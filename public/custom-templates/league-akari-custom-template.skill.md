---
name: league-akari-custom-template
description: Create or fully rewrite synchronous JavaScript for League Akari in-game custom send templates using source code that exactly matches the user's target version. Use for League Akari custom templates, getMessages(ctx), ctx.runtime.manager, or template runtime errors; do not use for fixed text, cloud template systems, or changes to the League Akari application source.
---

# League Akari Custom Send Templates

Create complete JavaScript that a user can paste into League Akari's in-game custom-template editor, or fully rewrite a broken template. A template converts the current send options and already available Akari runtime state into message strings.

## Scope

Use this skill for:

- a new League Akari in-game custom send template;
- a complete rewrite of a template that fails, returns the wrong content, or uses an obsolete contract;
- a question about `getMessages(ctx)`, `ctx.runtime.manager`, cached main-process state, or a visible template runtime error.

Do not use this skill for fixed-text presets, cloud template distribution, template marketplaces, installation instructions, or modifications to League Akari itself. If the request requires changing the application, state that it is a separate application-development task instead of silently expanding the template task.

## Communicate at the user's level

- Write the final answer in the user's language. This skill is written in English only to make its operating rules unambiguous.
- Default to product behavior: what will be sent, when it produces output, what happens when data is missing, and what an authorized write changes.
- Do not lead with shard IDs, internal fields, source paths, VM stages, or implementation terminology.
- A pasted code block or error message does not by itself mean the user is a programmer.
- Switch to technical detail only when the user asks about implementation/source or consistently uses technical concepts themselves.
- Source research is the agent's job. Do not ask the user to find a shard name or field path.

## Non-negotiable template contract

Start from this shape:

```js
function getMessages(ctx) {
  const { target } = ctx.options
  const { manager } = ctx.runtime

  return []
}
```

For the current contract:

- Define one top-level synchronous `getMessages(ctx)` function.
- Return a plain `string[]`. Return `[]` when this run should produce no messages.
- Do not use CommonJS, ES modules, `async`, Promise-based flows, timers, or Node globals that the executor does not provide.
- `ctx` has exactly two top-level categories: `options` for this send action and `runtime` for Akari internals.
- `ctx.options.target` is the user's selected data target: `friendly`, `enemy`, or `all`. It does not switch the chat channel or rewrite messages automatically.
- `ctx.runtime.manager` is the real main-process `AkariManager`, not a renderer manager and not a security boundary.
- Read already cached synchronous state whenever possible. The function cannot wait for a new request to finish.
- Do not add template metadata, a runtime version checker, cloud behavior, or compatibility code for older template formats.

Reconfirm this contract from the target-version executor before generating final code. If that exact version uses a different contract, explain the mismatch rather than guessing.

## Establish the exact source baseline

Never use remembered fields from another release as final evidence.

1. Discover the checkout, worktree, branch, commit, tag, fork, and dirty state that correspond to the user's target.
2. If the user targets the current development build, the current working tree, including uncommitted changes, is the source of truth.
3. If the user targets an installed or released build, identify its exact version/ref/fork and obtain matching source through a local checkout, CLI, GitHub, or another read-only route.
4. If the visible checkout and target application differ, ask in product language which version the template should support.
5. If matching source cannot be obtained, do not provide final code that depends on `manager` internals. Help the user supply the application version, source directory, repository, or exact ref.

A manager-free template may still be generated without application source when it depends only on the stable `ctx.options` contract confirmed by the target version.

## Low-ambiguity workflow

Do not collapse these steps into “I checked the source.” Complete them one at a time.

### 1. Write the product behavior first

Record internally:

- the intended mode family or queue family;
- the messages the user wants;
- ordering, filtering, grouping, and formatting;
- how `friendly`, `enemy`, and `all` differ;
- which missing values should be shown as unavailable and which should suppress all output;
- whether the template is read-only or intentionally performs a write.

Ask only about a missing product choice that would materially change the output. Do not ask implementation questions the source can answer.

### 2. Confirm the template executor

Search the target source for:

- `InGameSendCustomTemplateContext`;
- `InGameSendCustomTemplateExecutor`;
- the default `getMessages` template;
- result validation and runtime restrictions.

Write down four facts before coding: entry function, `ctx` top-level fields, synchronous/async rule, and required return shape.

### 3. Build a data inventory

For every user-visible value, fill an internal table. Do not leave guesses in it.

| Product value               | Supported mode family | Main shard ID   | Cached path or synchronous method | Product flows that populate it | Nullability     | Missing-data behavior               |
| --------------------------- | --------------------- | --------------- | --------------------------------- | ------------------------------ | --------------- | ----------------------------------- |
| Example: current game phase | source required       | source required | source required                   | source required                | source required | suppress or label, based on request |

If one cell says “probably,” “normally,” or “looks similar,” continue researching.

### 4. Prove every main shard identity

For each candidate shard, confirm all three:

1. its `*_MAIN_NAMESPACE` or equivalent ID constant;
2. the class `static id`;
3. main bootstrap registration through `manager.use(...)`.

All three must identify the same shard. A directory name, renderer store, or renderer shard ID is not proof.

### 5. Trace the actual state shape

Follow declarations, getters, adapters, and source-mode branches. Confirm:

- the exact field or synchronous method;
- whether it is public, private, computed, nullable, or initially empty;
- whether absence means “not loaded,” “not applicable,” or a real empty value;
- which product flows populate the data;
- whether accessing it has side effects.

Do not stop after finding one convenient field name.

### 6. Decide behavior before implementation

Translate the inventory into explicit decisions:

- supported and unsupported mode families;
- selected records for each target;
- fallback labels and ordering;
- duplicate handling;
- partial-data behavior;
- exact conditions that return `[]`;
- authorized writes and their limits.

### 7. Implement from the stable skeleton

Enter only through `ctx.options` and `ctx.runtime`. Read confirmed cached state, transform it with ordinary synchronous JavaScript, and return strings directly. Do not write an async design first and attempt to disguise it as synchronous later.

### 8. Audit every early return

For every `return []`, answer: “Is the requested product data truly unavailable here?”

Recheck the condition when the reason is merely:

- this is not the most familiar phase;
- a current-user identity is absent;
- one optional record has not loaded;
- a live flow is absent even though a preview/draft flow exists.

### 9. Validate representative inputs

Use read-only live state or source-accurate mocks. Cover:

- one normal input for every supported mode family;
- one explicit unsupported-mode input;
- one normal input for every relevant product mode;
- `friendly`, `enemy`, and `all` when target matters;
- one partial-cache case;
- one genuinely empty case;
- the return type and every array element type;
- any authorized write and its exact side effect.

Do not validate only a hand-built happy path while ignoring a source-supported mode.

### 10. Deliver the result

Return complete paste-ready JavaScript, not a patch fragment. Add only the product explanation, assumptions, limitations, and impact that the user needs.

Stop and request missing information when matching source is unavailable, the only possible data source is asynchronous with no cache, an exact ID/field cannot be proven, or an unresolved product choice materially changes the result.

## Source-navigation recipe

Use symbol search instead of assuming fixed paths or line numbers.

### Find the template contract

Search for the executor/context symbols listed above, then inspect the default template and result checks. Confirm both code-loading and invocation behavior.

### Find main shards

Search for likely feature names under main shards, then follow:

```text
namespace constant -> class static id -> bootstrap manager.use -> public state/data/method
```

Prefer main-process objects. Renderer Pinia stores can help understand product presentation, but a template receives the main manager and cannot directly depend on renderer-only state.

### Find lifecycle and product modes

Search for:

- phase/state unions;
- computed getters;
- live, lobby, draft, preview, replay, or handoff branches;
- clear/reset behavior;
- loaders and their loading-state maps.

This prevents a template from treating “not in the common live path” as “no usable data.”

### Cite source only when useful

When the user asks for technical evidence, cite a relative path plus a symbol, not a line number. For ordinary users, keep the research internal.

## Reading runtime state safely

### Prefer cached state over APIs

An API method that returns a Promise is not usable merely because it exists on a shard. The template must finish synchronously. Look for the state that the shard's loader or controller has already populated.

Good pattern:

```js
const shard = manager.getInstance('confirmed-main-id')
if (!shard) return []

const cachedValue = shard.state.someConfirmedField
return cachedValue ? [String(cachedValue)] : []
```

The names above are placeholders. Replace them only with target-source-confirmed names.

### Distinguish missing, empty, and not applicable

Do not automatically treat all falsy values alike:

- `undefined` may mean a loader has not completed;
- `null` may be an explicit unavailable state;
- `[]` or `{}` may be a valid empty result;
- `0` and `false` may be real values.

Use the authoritative type and loader behavior to decide what the user should see.

### Use private fields only deliberately

Private or implementation-level fields are allowed when they exist in the exact target source and are the best fit. Keep the explanation short: the template depends on the current application version and may need regeneration after an update.

### Do not expose internals

Never emit credentials, tokens, authorization headers, connection secrets, or a serialized internal object. Select and format only the product values the user requested.

## Mode specialization comes before template logic

Assume one template serves one mode family unless the user explicitly requests a multi-mode template. Ranked, Arena, ARAM Mayhem, standard ARAM, normal custom games, and temporary modes can expose different player grouping, positions, ranks, augments, and queue metadata.

A “universal” template is usually less reliable than several small mode-specific templates. For a multi-mode request:

1. identify the mode before reading mode-specific fields;
2. create a separate branch and data inventory for each supported mode family;
3. return `[]` for unsupported modes unless the user requests a visible explanation;
4. validate each branch independently;
5. do not reuse rank, position, team, or augment assumptions across branches without source evidence.

### Current-version mode profile examples

These profiles are decision examples, not permanent queue contracts:

| Mode family                   | Commonly meaningful data                             | Current important difference                                                                                                                                                 |
| ----------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ranked/classic team modes     | rank, lane/position, two team sides, champions       | rank and position assumptions can be useful, but still verify queue and product flow                                                                                         |
| Arena / `CHERRY`              | champions, all visible players, augment-related data | current ongoing-game extraction flattens players into `TEAM-ALL`; squad ownership is not reliably available in this context, so templates should normally support only `all` |
| ARAM Mayhem                   | champions and augment-related data                   | lane rank/position assumptions do not apply; augment data is mode-relevant                                                                                                   |
| Standard ARAM and other modes | mode-specific rosters and cached data                | do not assume Mayhem augments, ranked positions, or Arena grouping                                                                                                           |

### Detect the mode from source-backed runtime data

Potential signals include queue ID, queue type, game mode, normalized mode adapters, draft mode kind, and game-mode mutators. Their exact names and values can differ between live state, draft state, champion-data adapters, and historical match data.

Do not assume a normalized product label such as `aram_mayhem` is also the literal live queue type. Trace the target version's queue/mode adapter and choose the signal that exists synchronously in the selected runtime state.

Record a small internal mode profile before coding:

| Question                              | Required answer                                       |
| ------------------------------------- | ----------------------------------------------------- |
| Which exact mode family is supported? | one explicit family, or an explicit list              |
| How is it detected synchronously?     | confirmed field/method and values                     |
| Which player grouping exists?         | two teams, subteams, all players, or none             |
| Are positions meaningful?             | yes/no and source                                     |
| Is ranked data meaningful?            | yes/no and source                                     |
| Are augments meaningful?              | catalog, recommendations, or actual player selections |
| What should each target do?           | friendly/enemy/all mapping or an all-only rule        |

### Translate common product requests into precise research

Use these one-shot interpretations to reduce ambiguity for weaker models. They are examples of reasoning, not fixed source paths.

| User request                                      | What it usually means                                                           | What must be verified before coding                                                                                                              |
| ------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| “Show each player's champion, rank, and position” | one line or group per visible player in a ranked/classic team mode              | roster source, champion mapping, which ranked queue entry to display, position availability in every supported phase, and partial-cache behavior |
| “Show the augments”                               | ambiguous: catalog, recommendations, or actual choices                          | ask which product meaning is intended, then locate the matching synchronous cache; never choose one meaning silently                             |
| “Let me preview another match setup”              | support manual draft state, possibly without a current-user identity            | computed draft-aware teams/selections/positions, nullable draft perspective, mode kind, and fallback team labels                                 |
| “Summarize recent performance”                    | transform already loaded match summaries or details                             | which histories are already cached, loading state, queue/mode filters, minimum sample, remakes, and missing details                              |
| “Show premade groups”                             | use a source-backed inferred or explicit grouping, not identical names or ranks | current grouping model, confidence/availability, and modes where grouping is meaningful                                                          |
| “Work in every mode”                              | several independent products hidden behind one sentence                         | propose separate templates by mode family; if the user insists, define detection, output, and tests for every branch                             |

For example, do not answer “show the augments” by reading the global augment catalog and printing its first entries. First determine whether the user wants recommendations for the selected champion, choices made by players in a loaded match, or merely name lookup for known augment IDs.

### Use a join plan for player-oriented output

Most nontrivial templates combine several maps. Write the join plan before code:

1. Start with the supported mode's authoritative roster and target selection.
2. Preserve that order unless the user asks for sorting.
3. For each player identifier, look up champion selection and optional caches separately.
4. Decide field-by-field fallbacks. A missing rank must not remove an otherwise valid champion line unless the user explicitly requires rank-only output.
5. Filter sentinel or empty identifiers according to the source's own rules.
6. Format only after selection and joining are complete.

Bad sequence: enumerate the rank cache and infer that its keys are the complete team. Good sequence: enumerate the team roster, then attach rank when the corresponding cache entry exists.

### Augment data is not one thing

Distinguish at least these concepts when the source exposes them:

- the augment catalog: IDs, names, descriptions, and icons;
- champion-data recommendations: popular or strong augments for a champion/mode;
- actual participant selections in a loaded match or summary;
- live selections, only if the current source truly caches them synchronously.

For the current source, the League Client game-data cache contains an augment catalog, while normalized match participants can contain selected augment IDs. Champion-data sources can separately provide Arena or ARAM Mayhem recommendations. Do not use a catalog as if it were a player's selection, and do not call an async recommendation loader inside `getMessages`.

### Product flows still matter inside one mode

Product modes are not universal across shards. Current ongoing-game state can come from live champion select, in-game state, lobby state, unavailable state, and manual draft/preview state. A mode-specific template must still decide which of these flows provide its requested data.

Do not introduce a phase whitelist when checking the required cached structures is sufficient. If a phase check is needed, derive the accepted set from every source branch that can populate the data.

Treat phase and game mode as two independent axes:

| Axis             | Examples                                            | What it changes                                                                                |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Product phase    | draft, champion select, lobby, in game, unavailable | where data comes from, whether it has loaded, and whether generated lines can actually be sent |
| Game mode family | ranked, classic, Arena, ARAM Mayhem, standard ARAM  | which fields are meaningful and how players are grouped                                        |

Do not write one condition such as “in game means ranked” or “draft means classic.” A draft can represent normal or Arena data, and a live game can use many mode families.

Current source has an especially important delivery distinction:

- a template can be dry-run against a manual draft because computed ongoing-game state reads the draft first;
- actual sending accepts champion select, lobby, and in-game phases;
- actual sending rejects the draft and unavailable phases even when `getMessages` produced valid lines;
- champion-select and lobby lines are joined into one LCU chat message;
- in-game lines are entered one at a time through native input and require the game client to be in the foreground.

Explain this only when it affects the requested behavior. Do not promise that a successful draft preview can be sent from the draft screen.

### Know which kind of state you are reading

Classify each source before using it:

| State class              | Typical meaning                                          | Template consequence                                                                                                       |
| ------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Computed current state   | teams, champion selections, positions, query stage       | often best for live plus draft support because the getter already selects the active product flow                          |
| Per-player loaded cache  | profile, rank, mastery, saved notes                      | entries can be missing temporarily or individually; do not discard every player because one cache entry is absent          |
| Loaded match cache       | summaries and details already fetched by ongoing-game UI | useful for historical behavior, but absence can mean “not loaded yet,” not “the player has no games”                       |
| Static game-data catalog | champions, queues, augments, mutators                    | describes available game content; it does not prove what a participant selected or what is recommended                     |
| Recommendation service   | mode/champion builds and augments                        | frequently loaded asynchronously; an API or loader existing does not make its result synchronously available to a template |

The current ongoing-game player loader reacts to the computed team roster, then asynchronously fills separate maps for profiles, ranks, saved information, mastery, and match history. Therefore a roster may be present before those maps are complete. Prefer partial output or a user-approved “loading/unavailable” label over returning `[]` for the whole template.

### Do not confuse current and historical team models

The same mode can have different grouping quality in different products:

- current Arena ongoing-game state currently exposes visible players through `TEAM-ALL`;
- loaded historical Arena matches can include a participant subteam ID and may be adapted into `CHERRY-N` groups;
- participant-group metadata may exist internally without establishing which Arena squad belongs to the current user;
- a historical subteam field does not authorize inventing live friendly/enemy Arena teams.

Choose the team model belonging to the exact requested product flow. If the user asks about current Arena, use the current all-only behavior. If the user asks about loaded historical matches, separately trace the historical adapter and define what “friendly” means there.

### Expect hidden, anonymous, and partially identified players

Champion select and other Riot flows can hide identities or expose empty/obfuscated identifiers. Source code may deliberately filter sentinel IDs, and a manual draft may have no perspective player at all.

- Do not use a missing profile name as proof that the roster is empty.
- Join caches by the confirmed identifier, but keep roster selection independent from optional profile/rank data.
- If a readable name is unavailable, use a product-approved fallback such as champion name, side slot, or “Unknown player”; otherwise omit that record.
- Do not print raw identifiers merely to fill the gap unless the user explicitly wants them.

### Define target semantics per mode

`target` controls data selection only:

- `friendly`: the friendly-side data selected by the template;
- `enemy`: the opposing-side data selected by the template;
- `all`: both sets in a documented order, or every visible player for an all-only mode.

When perspective cannot be established, use a user-approved fallback rather than pretending a side is friendly. For classic two-team data, a practical current convention is blue side for `friendly`, red side for `enemy`, and blue then red for `all`, with visible labels “Blue” and “Red.”

For current Arena ongoing-game data, do not apply classic blue/red or friendly/enemy grouping. The source produces `TEAM-ALL` because reliable squad membership is not available in this context. An Arena template should normally return output only for `target === 'all'` and return `[]` for `friendly` or `enemy`.

## Read-only and write templates

Default to read-only behavior.

If the user explicitly requests a write, that request is authorization; do not ask for a second confirmation. Before the code, explain in plain language exactly what changes and when. Then:

- call only the confirmed synchronous operation needed for the request;
- avoid broader state changes;
- do not persist extra metadata;
- do not log or return sensitive internals;
- return messages that truthfully describe what happened.

If the only write API is asynchronous, explain that the current template contract cannot wait for it. Do not fire an unobserved Promise and claim success.

## Avoid speculative defense

Handle states proven by types, loaders, and product flows. Avoid:

- large `try/catch` wrappers around the entire template;
- compatibility branches for versions the user did not request;
- repeated optional checks for impossible states;
- silent fallbacks that change the user's meaning;
- defensive code much larger than the product logic.

Small checks for a missing shard, documented nullable state, or a partially loaded cache are appropriate.

## Generate a new template

1. Establish the exact source baseline.
2. Extract product behavior from the request.
3. Ask only the product questions that cannot be inferred.
4. Build and verify the data inventory.
5. Write complete synchronous code.
6. Validate representative modes and missing-data behavior.
7. Deliver the complete template and concise product explanation.

If the request needs data that exists only behind an immediate asynchronous request, explain the limitation in product terms and offer the nearest useful version based on existing cache. Do not turn it into an application-source change.

## Fully rewrite a broken template

Obtain the complete current code plus the visible error or wrong behavior. Internally classify the failure as loading, entry contract, execution, or result shape, but do not expose those stages to ordinary users unless useful.

Reconfirm source and rewrite the entire structure while preserving still-valid user-visible behavior: wording, filtering, ordering, grouping, and target semantics.

Common multi-fault input:

```js
async function getMessages(ctx) {
  const game = ctx.manager.getInstance('guessed-id')
  return { messages: await game.getPlayers(ctx.target) }
}
```

This is not fixed by renaming one field. It has the wrong `ctx` paths, async behavior, guessed runtime access, and wrong result shape. Rebuild it from the stable contract and confirmed cache.

## Runnable examples

Examples 2-5 contain current-version internals. Reconfirm them before using them for another release or fork.

### Example 1: target-only template

This example does not need `manager` and is directly pasteable:

```js
function getMessages(ctx) {
  const { target } = ctx.options

  if (target === 'friendly') {
    return ['Friendly target selected']
  }

  if (target === 'enemy') {
    return ['Enemy target selected']
  }

  if (target === 'all') {
    return ['All targets selected']
  }

  return []
}
```

It demonstrates selection only; it does not route the message to a chat channel.

### Example 2: read one cached main-process value

Current-version read-only example:

```js
function getMessages(ctx) {
  const { manager } = ctx.runtime
  const leagueClient = manager.getInstance('league-client-main')

  if (!leagueClient) {
    return []
  }

  const phase = leagueClient.data.gameflow.phase
  return phase ? [`Gameflow phase: ${phase}`] : []
}
```

The source-backed pattern is stable even if the ID or field changes: resolve one main shard, read one cached value synchronously, format it, and return strings.

### Example 3: classic two-team counts with preview support

Current-version read-only example. It supports live or draft-derived teams because it reads the computed team state instead of rejecting non-live phases.

```js
function getMessages(ctx) {
  const { target } = ctx.options
  const { manager } = ctx.runtime
  const ongoingGame = manager.getInstance('ongoing-game-main')
  const leagueClient = manager.getInstance('league-client-main')

  if (!ongoingGame || !leagueClient) {
    return []
  }

  const state = ongoingGame.state
  const teams = Object.entries(state.teams).filter(
    ([teamId, members]) => teamId !== 'TEAM-ALL' && members.length > 0
  )

  const perspectivePuuid = state.draft ? state.draft.puuid : leagueClient.data.summoner.me?.puuid

  const confirmedFriendly = perspectivePuuid
    ? teams.find(([, members]) => members.includes(perspectivePuuid))
    : null

  const blue = teams.find(([teamId]) => teamId === 'TEAM-100')
  const red = teams.find(([teamId]) => teamId === 'TEAM-200')
  const fallback = !confirmedFriendly && blue && red

  if (!confirmedFriendly && !fallback) {
    return []
  }

  const friendly = confirmedFriendly || blue
  const enemies = fallback ? [red] : teams.filter(([teamId]) => teamId !== friendly[0])

  const selected =
    target === 'friendly'
      ? [friendly]
      : target === 'enemy'
        ? enemies
        : target === 'all'
          ? [friendly, ...enemies]
          : []

  return selected.map(([teamId, members], index) => {
    const label = fallback
      ? teamId === 'TEAM-100'
        ? 'Blue'
        : 'Red'
      : index === 0 && target !== 'enemy'
        ? 'Friendly'
        : 'Enemy'

    return `${label}: ${members.length} players`
  })
}
```

This is a case study, not a universal team algorithm. Recheck special modes, team IDs, and perspective rules for the target version and request.

### Example 4: current Arena all-only output

Current-version read-only example. It demonstrates the Arena exception without pretending that current squad ownership is available:

```js
function getMessages(ctx) {
  const { target } = ctx.options
  const { manager } = ctx.runtime
  const ongoingGame = manager.getInstance('ongoing-game-main')

  if (!ongoingGame || target !== 'all') {
    return []
  }

  const state = ongoingGame.state
  const isArena = state.queryStage.gameInfo?.queueType === 'CHERRY'
  const players = state.teams['TEAM-ALL']

  if (!isArena || !Array.isArray(players) || players.length === 0) {
    return []
  }

  return [`Arena players: ${players.length}`]
}
```

This example deliberately returns no lines for `friendly` or `enemy`. It counts the current visible roster; it does not use historical Arena subteams and does not claim to know the user's squad.

### Example 5: explicitly authorized synchronous write

Use a write template only when the user asks for this effect. Current-version example that clears the manual ongoing-game draft preview:

```js
function getMessages(ctx) {
  const { manager } = ctx.runtime
  const ongoingGame = manager.getInstance('ongoing-game-main')

  if (!ongoingGame || !ongoingGame.state.draft) {
    return []
  }

  ongoingGame.state.setDraft(null)
  return ['Draft preview cleared']
}
```

Before delivering code like this, say that running it clears the current preview state. Do not generalize this authorization to other writes.

### Example 6: local VM harness

This harness runs outside League Akari. Do not paste the harness into the template editor. Replace `templateCode` and the mock manager with source-accurate values:

```js
const vm = require('node:vm')

const templateCode = `
function getMessages(ctx) {
  return [ctx.options.target]
}
`

const sandbox = {}
const context = vm.createContext(sandbox)

new vm.Script(templateCode).runInContext(context, { timeout: 1000 })

sandbox.__ctx = Object.freeze({
  options: Object.freeze({ target: 'friendly' }),
  runtime: Object.freeze({
    manager: {
      getInstance() {
        return undefined
      }
    }
  })
})

const result = new vm.Script('getMessages(globalThis.__ctx)').runInContext(context, {
  timeout: 1000
})

if (!Array.isArray(result) || result.some((line) => typeof line !== 'string')) {
  throw new Error('Template must return string[]')
}

console.log(result)
```

Set the harness timeout to the target executor's current value when exact parity matters. Use multiple mock contexts instead of one happy path.

## Validation checklist

Before delivery, verify:

- exact target source/ref is established;
- the template contract matches that source;
- every shard ID is proven by constant, class ID, and bootstrap registration;
- every field/method shape, nullability, and synchrony is source-confirmed;
- phase and game mode are modeled independently;
- all relevant mode families and product phases are covered;
- current, historical, catalog, recommendation, and selected-player data are not confused;
- partial per-player caches do not erase otherwise valid roster output;
- hidden or unidentified players have an intentional product behavior;
- every `return []` is justified by product behavior or real data absence;
- the function is top-level, synchronous, and always returns `string[]`;
- no module syntax, Promise flow, timer, unsupported global, credential output, or version checker exists;
- target affects data selection, not assumed chat routing;
- dry-run success is not described as send success in an unsendable phase;
- authorized writes are explained and narrowly scoped;
- defenses are proportional to real states;
- representative live/preview/partial/empty inputs have been tested as applicable.

## Delivery format

- Default: complete JavaScript, then only necessary product behavior, assumptions, and limitations.
- For a repair: briefly explain the actual user-visible cause of failure.
- For internal-field dependence: briefly note that an application update may require regeneration.
- If the user asks for technical evidence: provide shard IDs, fields, and relative path plus symbol.
- If the user asks for “code only”: output code only.
- Otherwise end with a short reminder to save the template and use the UI's dry-run action before sending.
