# Pathway service

This isolated service accepts evidence events and normalizes them for a live-data pipeline. It is intentionally a small HTTP-compatible fallback until a Pathway deployment is available. Start it with `python main.py`; the app continues in fallback mode when `PATHWAY_SERVICE_URL` is unset.
