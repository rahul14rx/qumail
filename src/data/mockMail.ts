export type MailItem = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body: string;
  time: string;
};

export const mockInbox: MailItem[] = [
  {
    id: "1",
    from: "alice@demo",
    subject: "Welcome to QuMail",
    snippet: "This is a demo inbox layout...",
    body: "This is where decrypted mail will show.\n\nNext we wire encryption + IMAP/SMTP.",
    time: "09:10",
  },
  {
    id: "2",
    from: "security@demo",
    subject: "QKD mode enabled",
    snippet: "Keys are being fetched from KM-mock...",
    body: "KM-mock is responding. Next step: encrypt message payload with selected security level.",
    time: "09:25",
  },
];
