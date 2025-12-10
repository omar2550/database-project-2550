export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          id: number;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      container_products: {
        Row: {
          container_number: string;
          product_id: number;
          quantity: number;
        };
        Insert: {
          container_number: string;
          product_id: number;
          quantity: number;
        };
        Update: {
          container_number?: string;
          product_id?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_container_products_container";
            columns: ["container_number"];
            isOneToOne: false;
            referencedRelation: "containers";
            referencedColumns: ["container_number"];
          },
          {
            foreignKeyName: "fk_container_products_product";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      containers: {
        Row: {
          container_number: string;
          seal_number: string;
          shipment_no: number | null;
          weight: number;
        };
        Insert: {
          container_number: string;
          seal_number: string;
          shipment_no?: number | null;
          weight: number;
        };
        Update: {
          container_number?: string;
          seal_number?: string;
          shipment_no?: number | null;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_containers_shipment";
            columns: ["shipment_no"];
            isOneToOne: false;
            referencedRelation: "shipments";
            referencedColumns: ["shipment_number"];
          },
        ];
      };
      dependents: {
        Row: {
          birthdate: string | null;
          employee_ssn: number;
          name: string;
          relationship: string | null;
          sex: string | null;
        };
        Insert: {
          birthdate?: string | null;
          employee_ssn: number;
          name: string;
          relationship?: string | null;
          sex?: string | null;
        };
        Update: {
          birthdate?: string | null;
          employee_ssn?: number;
          name?: string;
          relationship?: string | null;
          sex?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_dependents_employee";
            columns: ["employee_ssn"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["ssn"];
          },
        ];
      };
      drivers: {
        Row: {
          employee_ssn: number | null;
          license_number: string;
          license_type: string;
        };
        Insert: {
          employee_ssn?: number | null;
          license_number: string;
          license_type: string;
        };
        Update: {
          employee_ssn?: number | null;
          license_number?: string;
          license_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_drivers_employee";
            columns: ["employee_ssn"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["ssn"];
          },
        ];
      };
      employees: {
        Row: {
          address: string | null;
          birthdate: string | null;
          email: string;
          first_name: string;
          hire_date: string | null;
          last_name: string;
          phone: string | null;
          salary: number | null;
          sex: string | null;
          ssn: number;
          warehouses_code: string | null;
        };
        Insert: {
          address?: string | null;
          birthdate?: string | null;
          email: string;
          first_name: string;
          hire_date?: string | null;
          last_name: string;
          phone?: string | null;
          salary?: number | null;
          sex?: string | null;
          ssn: number;
          warehouses_code?: string | null;
        };
        Update: {
          address?: string | null;
          birthdate?: string | null;
          email?: string;
          first_name?: string;
          hire_date?: string | null;
          last_name?: string;
          phone?: string | null;
          salary?: number | null;
          sex?: string | null;
          ssn?: number;
          warehouses_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_employees_warehouses";
            columns: ["warehouses_code"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["code"];
          },
        ];
      };
      importers: {
        Row: {
          address: string;
          city: string;
          company_name: string;
          contact_person: string;
          country: string;
          email: string;
          iso_code: string;
          tax_id: string;
        };
        Insert: {
          address: string;
          city: string;
          company_name: string;
          contact_person: string;
          country: string;
          email: string;
          iso_code: string;
          tax_id: string;
        };
        Update: {
          address?: string;
          city?: string;
          company_name?: string;
          contact_person?: string;
          country?: string;
          email?: string;
          iso_code?: string;
          tax_id?: string;
        };
        Relationships: [];
      };
      importers_phone: {
        Row: {
          code: string;
          importers_code: string;
          number: string;
        };
        Insert: {
          code: string;
          importers_code: string;
          number: string;
        };
        Update: {
          code?: string;
          importers_code?: string;
          number?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_importers_phone_importers";
            columns: ["importers_code"];
            isOneToOne: false;
            referencedRelation: "importers";
            referencedColumns: ["iso_code"];
          },
        ];
      };
      inventory: {
        Row: {
          last_updated: string;
          location_in_warehouse: string | null;
          product_id: number;
          quantity: number;
          warehouse_code: string;
        };
        Insert: {
          last_updated: string;
          location_in_warehouse?: string | null;
          product_id: number;
          quantity: number;
          warehouse_code: string;
        };
        Update: {
          last_updated?: string;
          location_in_warehouse?: string | null;
          product_id?: number;
          quantity?: number;
          warehouse_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_inventory_product";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_inventory_warehouse";
            columns: ["warehouse_code"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["code"];
          },
        ];
      };
      payment_methods: {
        Row: {
          description: string | null;
          id: number;
          method_name: string;
        };
        Insert: {
          description?: string | null;
          id: number;
          method_name: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          method_name?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          currency: string;
          payment_date: string;
          payment_method_id: number;
          payment_status: string;
          shipment_no: number;
          transaction_reference: string;
        };
        Insert: {
          amount: number;
          currency: string;
          payment_date: string;
          payment_method_id: number;
          payment_status: string;
          shipment_no: number;
          transaction_reference: string;
        };
        Update: {
          amount?: number;
          currency?: string;
          payment_date?: string;
          payment_method_id?: number;
          payment_status?: string;
          shipment_no?: number;
          transaction_reference?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_payments_method";
            columns: ["payment_method_id"];
            isOneToOne: false;
            referencedRelation: "payment_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_payments_shipment";
            columns: ["shipment_no"];
            isOneToOne: false;
            referencedRelation: "shipments";
            referencedColumns: ["shipment_number"];
          },
        ];
      };
      products: {
        Row: {
          category_id: number | null;
          country_of_origin: string | null;
          currency: string | null;
          customs_rate: number | null;
          description: string | null;
          hs_code: number | null;
          id: number;
          name: string;
          price: number;
          weight: number | null;
        };
        Insert: {
          category_id?: number | null;
          country_of_origin?: string | null;
          currency?: string | null;
          customs_rate?: number | null;
          description?: string | null;
          hs_code?: number | null;
          id: number;
          name: string;
          price: number;
          weight?: number | null;
        };
        Update: {
          category_id?: number | null;
          country_of_origin?: string | null;
          currency?: string | null;
          customs_rate?: number | null;
          description?: string | null;
          hs_code?: number | null;
          id?: number;
          name?: string;
          price?: number;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_products_category";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      shipment_status_history: {
        Row: {
          changed_at: string;
          changer_ssn: number;
          shipment_no: number;
        };
        Insert: {
          changed_at: string;
          changer_ssn: number;
          shipment_no: number;
        };
        Update: {
          changed_at?: string;
          changer_ssn?: number;
          shipment_no?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_status_history_changedby";
            columns: ["changer_ssn"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["ssn"];
          },
          {
            foreignKeyName: "fk_status_history_shipment";
            columns: ["shipment_no"];
            isOneToOne: false;
            referencedRelation: "shipments";
            referencedColumns: ["shipment_number"];
          },
        ];
      };
      shipment_transportation: {
        Row: {
          checkpoint: string | null;
          shipment_no: number;
          transportation_no: string;
        };
        Insert: {
          checkpoint?: string | null;
          shipment_no: number;
          transportation_no: string;
        };
        Update: {
          checkpoint?: string | null;
          shipment_no?: number;
          transportation_no?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_shipment_transportation_shipment";
            columns: ["shipment_no"];
            isOneToOne: false;
            referencedRelation: "shipments";
            referencedColumns: ["shipment_number"];
          },
          {
            foreignKeyName: "fk_shipment_transportation_transport";
            columns: ["transportation_no"];
            isOneToOne: false;
            referencedRelation: "transportation";
            referencedColumns: ["registration_number"];
          },
        ];
      };
      shipments: {
        Row: {
          arrival_date: string;
          destination_port: string;
          importer_code: string | null;
          origin_port: string;
          shipment_date: string;
          shipment_number: number;
          status: string;
          total_weight: number;
          tracking_number: string;
          warehouse_code: string | null;
        };
        Insert: {
          arrival_date: string;
          destination_port: string;
          importer_code?: string | null;
          origin_port: string;
          shipment_date: string;
          shipment_number: number;
          status: string;
          total_weight: number;
          tracking_number: string;
          warehouse_code?: string | null;
        };
        Update: {
          arrival_date?: string;
          destination_port?: string;
          importer_code?: string | null;
          origin_port?: string;
          shipment_date?: string;
          shipment_number?: number;
          status?: string;
          total_weight?: number;
          tracking_number?: string;
          warehouse_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_shipments_importer";
            columns: ["importer_code"];
            isOneToOne: false;
            referencedRelation: "importers";
            referencedColumns: ["iso_code"];
          },
          {
            foreignKeyName: "fk_shipments_warehouse";
            columns: ["warehouse_code"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["code"];
          },
        ];
      };
      transportation: {
        Row: {
          capacity_weight: number;
          driver_license_number: string | null;
          registration_number: string;
          state: string;
          type: string;
        };
        Insert: {
          capacity_weight: number;
          driver_license_number?: string | null;
          registration_number: string;
          state: string;
          type: string;
        };
        Update: {
          capacity_weight?: number;
          driver_license_number?: string | null;
          registration_number?: string;
          state?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_transportation_driver";
            columns: ["driver_license_number"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["license_number"];
          },
        ];
      };
      warehouses: {
        Row: {
          address: string;
          capacity: number;
          city: string;
          code: string;
          country: string;
          email: string;
          manager_ssn: number | null;
          name: string;
          phone: string;
        };
        Insert: {
          address: string;
          capacity: number;
          city: string;
          code: string;
          country: string;
          email: string;
          manager_ssn?: number | null;
          name: string;
          phone: string;
        };
        Update: {
          address?: string;
          capacity?: number;
          city?: string;
          code?: string;
          country?: string;
          email?: string;
          manager_ssn?: number | null;
          name?: string;
          phone?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_warehouses_manager";
            columns: ["manager_ssn"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["ssn"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

