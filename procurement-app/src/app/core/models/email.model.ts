export interface EmailThread {
  id: number;
  poNumber: string;
  messageId: string;
  parentMessageId: string | null;
  fromEmail: string;
  toEmail: string;
  subject: string;
  cleanedBody: string;
  rawContent: string;
  systemMessage: boolean;
  procurementRelated: boolean;
  processingState: ProcessingState;
  receivedAt: string;
  createdAt: string;
  depthLevel: number;
  metadata: string | null;
}

export interface EmailThreadHierarchy {
  email: EmailThread;
  children: EmailThreadHierarchy[];
}

export interface ThreadStats {
  totalEmails: number;
  procurementEmails: number;
  systemEmails: number;
  participants: string[];
  participantCount: number;
  firstEmail: string;
  lastEmail: string;
  stateBreakdown: Record<string, number>;
}

export type ProcessingState = 
  | 'EMAIL_RECEIVED'
  | 'CLASSIFIED'
  | 'CONTEXT_GATHERED'
  | 'INVENTORY_CHECKED'
  | 'RECOMMENDATIONS_SENT'
  | 'CONFIRMATION_RECEIVED'
  | 'PO_GENERATED'
  | 'ACCOUNTING_UPDATED'
  | 'COMPLETION_SENT'
  | 'NOT_PROCUREMENT'
  | 'USER_NOT_FOUND'
  | 'ERROR';
