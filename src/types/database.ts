export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          // the data expected from .select()
          id: number;
          category_name: string;
          user_id: number;
        };
        Insert: {
          // the data to be passed to .insert()
          id?: never; // generated columns must not be supplied
          category_name: string; // `not null` columns with no default must be supplied
          user_id: number; // nullable columns can be omitted
        };
      };
      links: {
        Row: {
          id: number;
          created_at: string;
          link: string;
          short_desc: string;
          user_id: number;
          categoty: number;
        };
        Insert: {
          id?: never;
          created_at?: never;
          link: string;
          short_desc: string;
          user_id: number;
          categoty: number;
        };
      };
      users: {
        Row: {
          id: number;
          username: string;
          tg_id: number;
        };
        Insert: {
          id?: never;
          username: string;
          tg_id: number;
        };
      };
    };
  };
}
