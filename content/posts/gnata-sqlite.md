+++
date = '2026-04-02T12:00:00+07:00'
draft = false 
title = "Gnata-SQLite won't save you $500K/yr, but it might be fun"
description = 'JSONata for SQLite - a Go extension, TinyGo WASM LSP, and CodeMirror editor with React integration'
tags = ["sqlite", "jsonata", "go", "wasm", "codemirror", "react"]
+++

<div style="text-align: center">

**[Playground](https://rbby.dev/gnata-sqlite/playground)** · **[Docs](https://rbby.dev/gnata-sqlite/)** · **[GitHub](https://github.com/rbbydotdev/gnata-sqlite)**

</div>

<a alt="gnata-sqlite playground" href="https://rbby.dev/gnata-sqlite/playground">
<img src="/gnata-sqlite/og-image.png" alt="Gnata SQLite" width="720" />
</a>

## Go + JSONata = Gnata / Gnata + SQLite = Gnata-SQLite 

Recently, [RecoLabs made the front page of Hacker News](https://news.ycombinator.com/item?id=47536712) with "Saving $500K/yr" by rewriting JSONata from JavaScript to Go with AI. They outline turning an agent loose for **7 hours** and **$400 in tokens** to produce **13,000 lines of Go** passing all **1,778 official JSONata test cases**-starting with the full test suite, then the rest of the codebase.

A static, simple language like Go appears to be a great fit for LLMs. Type errors are caught before runtime, simplicity reduces context blind spots, and the result is a fast executable with far lower memory requirements than a JavaScript runtime.

The project also introduced me to **JSONata**. The dev community has been jaded by end-all query languages like GraphQL. JSONata, by contrast, is *simple yet expressive* - users can do a lot with a little when querying JSON objects. It makes a strong enhancement to any app that needs user-facing data queries, even if it shouldn't be the foundation of an API or RPC layer.

{{< email-signup >}}
Join my email list for updates
{{< /email-signup >}}

---

### The problem: user-defined queries in SQL

This clicked for me. A current project had just implemented a way to let users write the `SELECT` part of a SQL statement. It was a prototype and **not fit for production**, mainly because of security and correctness issues. The approach was interesting: it takes the SELECT statement and evaluates it within the same query. This avoids DB-to-code round trips and pushes logic into the data layer, making usage across services simpler.

JSONata is a natural replacement for that clunky prototype. It is **safe from injection** and sealed to its own execution context, which keeps access controlled.

### Bridging Go and SQLite

Using cgo and SQLite's extension system, integrating Go with SQLite is straightforward. An expression like `Account.Order.Product` can reach into nested JSON stored in a column and pull exactly what you need-no extra parsing, no round trips.

Per-row transforms with `jsonata()`:

```sql
SELECT jsonata('title & " (" & $string(year) & ")"', data) FROM books;
```
```json
"Dune (1965)"
"Neuromancer (1984)"
"Snow Crash (1992)"
```

Aggregate across rows with `jsonata_query()` - build a full dashboard in a single expression:

```sql
SELECT jsonata_query('{
  "purchases":    $count($filter($, function($v){$v.action = "purchase"})),
  "revenue":      $sum($filter($, function($v){$v.action = "purchase"}).amount),
  "refunds":      $sum($filter($, function($v){$v.action = "refund"}).amount),
  "users":        $count($distinct(user)),
  "avg_purchase": $round($average($filter($, function($v){$v.action = "purchase"}).amount), 2)
}', data) FROM events;
```
```json
{
  "purchases": 20000,
  "revenue": 6808900,
  "refunds": -1015000,
  "users": 200,
  "avg_purchase": 340.45
}
```

### A tiny LSP for the browser

For the end-user experience, a rich editor was essential: schema awareness, hover hints, and autocomplete. Because of the size of the full Go implementation and potential speed issues, TinyGo was the right choice. It produces a much smaller binary at the cost of fewer runtime features. Here, it is a perfect fit: a WASM LSP with an **85KB** gzipped footprint.

The LSP can also plug into backend endpoints for autocomplete schema data. This allows the schema to be fetched from the server rather than shipped to the client.

Hover hints surface documentation inline - `$sum`, `$filter`, `$map`, and every built-in function:

<img src="/gnata-sqlite/hover-crop.png" alt="Hover tooltip showing $sum documentation with examples" width="640" />

Autocomplete is schema-aware - dot into a field and see its children with types:

<img src="/gnata-sqlite/autocomplete-crop.png" alt="Autocomplete dropdown showing Name (string) and Order (array) fields" width="560" />

### CodeMirror + React = drop-in editor

CodeMirror is a great fit here: a fast browser editor where you add features as needed-autocomplete, linting, and documentation hints. The `@gnata-sqlite/codemirror` and `@gnata-sqlite/react` packages make integration straightforward.

A simple transform:

```javascript
Account.Order.Product.{
  "name": Description.Colour & " " & Description.Width,
  "price": Price
}
```

Chained pipelines - filter, map, sort, format in one expression:

```javascript
Account.Order.Product
  [$price > 50]
  .{
    "item":  Description.Colour & " " & Description.Width,
    "total": $round(Price * Quantity, 2)
  }
  ^(>total)
```

### The optimizer: streaming vs accumulating

The naive way to implement `jsonata_query` is to buffer every row, build an array, and hand it to the JSONata evaluator. That works, but it's **439ms on 100K rows** and scales linearly in memory - every row lives in a Go slice until the expression finishes.

The current implementation does something different. At compile time, a query planner walks the JSONata AST and decomposes it into **streaming accumulators** - each one processes rows individually in constant memory, then the final result is assembled once after the last row. One table scan, one GJSON parse per row for all fields, O(1) memory.

The result: **83ms** - matching hand-optimized single-scan SQL (84ms) on the same 5-aggregate report.

The planner borrows ideas from engines that have solved this before: DuckDB's batch JSON shredding (extract all fields in one parse), ClickHouse's `-If` combinator (identical predicates evaluated once per row and shared across accumulators), Spark Catalyst's constant folding (`$sum(amount * 1.1)` becomes `$sum(amount) * 1.1`), and Postgres-style common subexpression elimination.

But not everything can stream. `$sort`, `$reduce`, and `$map` over the full row set require all rows in memory - there's no way around it. An expression that stays on the streaming path scales to millions of rows; one that falls back to accumulation hits a wall. The [optimizing queries](https://rbby.dev/gnata-sqlite/docs/guides/optimizing-queries) guide covers what streams, what doesn't, and how to stay on the fast path.

### The result

The result is a full-featured toolkit that makes adding powerful query capabilities to any app easy. Thanks to RecoLabs' work, there is now a solid Go JSONata implementation, and Gnata-SQLite wraps it in a CodeMirror editor with simple React integration and strong query support.

You can find some [benchmarks here](https://rbby.dev/gnata-sqlite/docs/explanation/benchmarks), to see how it stacks up against equivalent SQLite queries. Admittedly, some are a little painful. But the goal isn't to beat hand-optimized SQL - it's to give users a **fun**, powerful, flexible way to query their data without needing to write crusty SQL. For that, Gnata-SQLite delivers.


---

Found a bug? [Open an issue](https://github.com/rbbydotdev/gnata-sqlite/issues).  
Want to discuss? [GitHub Discussions](https://github.com/rbbydotdev/gnata-sqlite/discussions).
