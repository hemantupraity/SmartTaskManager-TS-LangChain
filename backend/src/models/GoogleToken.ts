export interface GoogleToken {
  user_id: string;          // Title
  email: string;            // Email
  access_token: string;     // Text
  refresh_token?: string | null;   // Text
  scope: string;            // Text
  token_type: string;       // Text
  expiry_date?: number | null; // Number
  created_at?: string;      // Date
  updated_at?: string;      // Date
}

// export interface GoogleToken {
//     user_id: string;
//     email: string | null;
//     access_token: string;
//     refresh_token?: string;
//     scope: string;
//     token_type: string;
//     expiry_date?: number | null;
//     created_at?: string; // optional, ISO string
//     updated_at?: string; // optional, ISO string
//   }