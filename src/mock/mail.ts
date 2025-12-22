import { MailItem } from "../types/mail";

export const mockMail: MailItem[] = [
  {
    id: "m1",
    folder: "Inbox",
    from: "bob@example.com",
    to: "alice@example.com",
    subject: "Project update",
    preview: "Here’s the latest update for QuMail…",
    body:
      "Hey Alice,\n\nHere’s the latest update for QuMail.\n- UI shell ready\n- KM keys fetching works\n\nNext: encryption & IMAP.\n\n— Bob",
    dateISO: new Date().toISOString(),
    hasAttachment: true,
    attachmentName: "report.pdf",
  },
  {
    id: "m2",
    folder: "Inbox",
    from: "security@lab.com",
    to: "alice@example.com",
    subject: "KM Health Check",
    preview: "KM status is UP. Keys available for bob…",
    body:
      "KM health check passed.\n\nNext steps:\n- Integrate encryption mode selection\n- Show proof-of-encryption metadata",
    dateISO: new Date(Date.now() - 3600_000).toISOString(),
  },
];
