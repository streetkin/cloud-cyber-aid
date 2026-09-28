<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI MIMIT chat: streaming via /api/chat (knowledge in src/lib/ai/knowledge.server.ts), call transcription via /api/transcribe; threads stored in localStorage (src/lib/aimimit/threads.ts) — user chose per-client threads saved only in the browser.
