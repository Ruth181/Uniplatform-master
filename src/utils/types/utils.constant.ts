export enum NODE_ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
export const NODE_ENV = process.env.NODE_ENV || NODE_ENVIRONMENT.DEVELOPMENT;

export const DefaultPassportLink = {
  male: 'https://ik.imagekit.io/cmz0p5kwiyok/public-images/male-icon_LyevsSXsx.png?updatedAt=1641364918016',
  female:
    'https://ik.imagekit.io/cmz0p5kwiyok/public-images/female-icon_MeVg4u34xW.png?updatedAt=1641364923710',
};

export enum TransactionPartyType {
  ME = 'ME',
  OTHER_PARTY = 'OTHER_PARTY',
}

export enum ProcessStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
}

export enum DecodedTokenKey {
  USER_ID = 'id',
  EMAIL = 'email',
  ROLE = 'role',
  AUTH_PROVIDER = 'authProvider',
  TOKEN_INITIALIZED_ON = 'iat',
  TOKEN_EXPIRES_IN = 'exp',
}

export enum MailSubject {
  SIGN_UP_VERIFICATION = 'Account Verification',
  ACCOUNT_BLOCKED = 'Blocked Account',
  VIEW_TRANSACTION_CHECKLIST = 'View Transaction Checklist',
}

export enum PhoneVerificationSubject {
  SIGN_UP_VERIFICATION = 'Account Verification',
  ACCOUNT_BLOCKED = 'Blocked Account',
}

export enum RequestStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
}

export enum PaymentProvider {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE',
}

export enum EducationalCategory {
  GRADUATE = 'GRADUATE',
  UNDER_GRADUATE = 'UNDER_GRADUATE',
}

export enum EducationalLevel {
  // LEVEL_100 = 'LEVEL_100',
  // LEVEL_200 = 'LEVEL_200',
  // LEVEL_300 = 'LEVEL_300',
  // LEVEL_400 = 'LEVEL_400',
  // LEVEL_500 = 'LEVEL_500',
  // LEVEL_600 = 'LEVEL_600',
  DIPLOMA = 'DIPLOMA',
  UNDER_GRADUATE = 'UNDER_GRADUATE',
  POST_GRADUATE = 'POST_GRADUATE',
  MASTERS = 'MASTERS',
  PHD = 'PHD',
  PROFESSOR = 'PROFESSOR',
}

export enum AppRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  HOD = 'HEAD_OF_DEPARTMENT',
  PROFESSOR = 'PROFESSOR',
  OTHER = 'OTHER',
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum RegistrationStatusType {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  UNSUCCESSFUL = 'UNSUCCESSFUL',
}

export enum ArticleType {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum ReactionType {
  LIKE = 'LIKE',
  BOOKMARK = 'BOOKMARK',
  SHARE = 'SHARE',
  READ = 'READ',
}

export enum ForumReactionType {
  RELEVANT = 'RELEVANT',
  NOT_RELEVANT = 'NOT_RELEVANT',
  LIKE = 'LIKE',
  VIEW = 'VIEW',
  DISLIKE = 'DISLIKE',
}

export enum NotificationType {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  ARTICLE_LIKE = 'ARTICLE_LIKE',
  NEW_MESSAGE = 'NEW_MESSAGE',
}

export enum MessageType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  LINK = 'LINK',
  LOCATION = 'LOCATION',
}

export enum WebsocketEventType {
  USER_JOINED = 'USER_JOINED',
  USER_JOINED_CONFIRMATION = 'USER_JOINED_CONFIRMATION',
  USER_TYPING = 'USER_TYPING',
  USER_TYPING_CONFIRMATION = 'USER_TYPING_CONFIRMATION',
  SEND_MESSAGE = 'SEND_MESSAGE',
  SEND_MESSAGE_CONFIRMATION = 'SEND_MESSAGE_CONFIRMATION',
  GET_ACTIVE_USERS = 'GET_ACTIVE_USERS',
}
