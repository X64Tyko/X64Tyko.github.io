# Working notes for this site

Editorial and mechanical standards. Edit freely; this is the source of truth,
and anything here overrides an assistant's instinct.

## What the site is for

Honest, polymath views and impressions. Not reach, not engagement, not eyes on
the page.

Whether anyone turns out to be interested is a **signal**, not a target: it
measures how close these takes actually are to the public pulse. That
distinction does real work. If reach were the goal, writing in shades would cost
something, and sanding the edges off would be a reasonable trade. Because
reception is a readout, writing anything other than what is actually thought
corrupts the instrument and the readout stops meaning anything.

So the principle below is not a sacrifice being made for integrity's sake. It is
the precondition for the measurement working at all.

> **This part stays private.** It is a working note, not something the site
> says. Nobody wants to be told their interest is being used as a gauge, and
> publishing it would make the writing sound like a hypothesis being tested
> rather than something actually meant. Do not put it on the About page, in a
> post, or anywhere reader-facing.
>
> The line: measuring yourself against your own archive is introspection and is
> fine to state, which is why the drift material in "Rebuilding this site" is
> published. Measuring yourself *using readers* makes the reader an instrument,
> and that stays in here.
>
> The site should also never present itself as farming engagement of any kind.

## The governing principle

**No absolutes, no black and white.** The truth, and a functioning logical mind,
work in shades, and the shades usually overlap.

In practice that means a piece should:

- Hold more than one reading at once when more than one is true, rather than
  picking the cleanest and arguing it.
- Say which parts are established, which are extrapolation, and which are
  guesses. Label them differently.
- Concede the strongest version of the other side before the reader thinks of
  it, and mean the concession rather than using it as a rhetorical move.
- Resist the tidy conclusion when the evidence is untidy. A piece that ends on
  "it depends, and here is what it depends on" is finished. A piece that ends on
  a verdict the evidence does not carry is not.

This is not the same as hedging. Take positions. Just take the position the
evidence supports, at the confidence the evidence supports, and be specific
about where that runs out.

## Voice

Things that are his and must not be "fixed":

- **Contractions.** "there's", "I'm", "that's", "wasn't". Writing "it is" and
  "I am not" is the fastest way to make prose sound like someone else.
- **Rule of three.** A guideline rather than a law; four is fine when the fourth
  earns it.
- **Generic intensifiers.** "genuinely satisfying", "immensely satisfying".
- **Personal asides and self-deprecation.** "I should admit however...", "not
  just an old man who yells at clouds".
- Slightly loose grammar and comma placement.

Things to cut:

- **Em dashes.** None, anywhere. Use colons, full stops or parentheses.
- **Narrating the essay's own structure.** "Having set that up as a clean
  opposition...", "Then the part that actually makes the point". A personal
  aside is not the same thing and stays.
- **Stacked aphorisms.** One epigram-shaped closer in a passage reads as a good
  line. Three read as effort.
- Consultancy register: "serves as a valuable case study", "the key takeaways
  are clear".

## Structure

Three tracks, set per post with `area`: `engineering`, `games`, `industry`.

Two series, which cross tracks:

- **Code Critical** — hard looks at patterns that get repeated without their
  reasons.
- **Design Dissection** — how a thing works, what it costs, and the context for
  judging when it is worth it. Holds a `subseries`, currently Rail Shooters.

The Industry track has an additional editorial standard about presenting
plausible readings rather than asserting one. It lives next to the track
definition in `src/data/tracks.ts`.

## Mechanics

- **Drafts** (`draft: true`) are built as unlisted pages: reachable by URL,
  `noindex`, absent from every listing, feed and the sitemap.
- **Titles must be unique** across posts and reviews, because comment threads
  are keyed on `og:title`. `scripts/check-titles.mjs` enforces this at build.
- **Retitling a published post orphans its comment thread.** Treat published
  titles as frozen once a thread has replies.
- **Review scores are derived** from the section breakdown. Do not set `score`
  by hand when a full breakdown exists.
- `npm run content` lists everything with track, series, status and filename.
  Takes a filter argument, plus `--live` and `--draft`.

## House rules for tooling

- Never write frontmatter-parsing regexes that assume LF. In JavaScript `\r` is
  a line terminator, so `.` will not cross it and `$` without `/m` will not
  match before it, which means a CRLF file parses as nothing, silently. Use
  `scripts/frontmatter.mjs`.
- Verify by checking the thing that would break, not the thing that is easy to
  grep. Several bugs here survived a check that was passing for the wrong
  reason.
