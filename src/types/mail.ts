export type MailFolder = "Inbox" | "Sent" | "Drafts" | "Trash";

export type MailItem = {
  id: string;
  folder: MailFolder;
  from: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  dateISO: string;
  hasAttachment?: boolean;
  attachmentName?: string;
};
