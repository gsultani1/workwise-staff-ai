export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      classifications: {
        Row: {
          class_id: number
          class_name: string | null
          id: number
          subclass_id: number
          subclass_name: string | null
        }
        Insert: {
          class_id: number
          class_name?: string | null
          id?: never
          subclass_id: number
          subclass_name?: string | null
        }
        Update: {
          class_id?: number
          class_name?: string | null
          id?: never
          subclass_id?: number
          subclass_name?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string
          id: number
          last_name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: never
          last_name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: never
          last_name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discounts: {
        Row: {
          discount_percentage: number
          end_date: string
          id: number
          product_id: number
          start_date: string
        }
        Insert: {
          discount_percentage: number
          end_date: string
          id?: never
          product_id: number
          start_date: string
        }
        Update: {
          discount_percentage?: number
          end_date?: string
          id?: never
          product_id?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_discounts_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      fractional_pricing: {
        Row: {
          created_at: string | null
          effective_date: string | null
          end_date: string | null
          fraction_max: number
          fraction_min: number
          id: number
          markup_percentage: number | null
          master_sku_id: number | null
          price_per_unit: number
          special_pricing: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          effective_date?: string | null
          end_date?: string | null
          fraction_max: number
          fraction_min: number
          id?: number
          markup_percentage?: number | null
          master_sku_id?: number | null
          price_per_unit: number
          special_pricing?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          effective_date?: string | null
          end_date?: string | null
          fraction_max?: number
          fraction_min?: number
          id?: number
          markup_percentage?: number | null
          master_sku_id?: number | null
          price_per_unit?: number
          special_pricing?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fractional_pricing_master_sku_id_fkey"
            columns: ["master_sku_id"]
            isOneToOne: false
            referencedRelation: "master_skus"
            referencedColumns: ["id"]
          },
        ]
      }
      fractional_sales: {
        Row: {
          created_at: string | null
          cut_notes: string | null
          cut_pattern: string | null
          employee_id: number | null
          fraction_sold: number
          id: number
          is_custom_price: boolean | null
          master_sku_id: number | null
          notes: string | null
          sale_price: number
          transaction_id: string | null
          waste_factor: number | null
        }
        Insert: {
          created_at?: string | null
          cut_notes?: string | null
          cut_pattern?: string | null
          employee_id?: number | null
          fraction_sold: number
          id?: number
          is_custom_price?: boolean | null
          master_sku_id?: number | null
          notes?: string | null
          sale_price: number
          transaction_id?: string | null
          waste_factor?: number | null
        }
        Update: {
          created_at?: string | null
          cut_notes?: string | null
          cut_pattern?: string | null
          employee_id?: number | null
          fraction_sold?: number
          id?: number
          is_custom_price?: boolean | null
          master_sku_id?: number | null
          notes?: string | null
          sale_price?: number
          transaction_id?: string | null
          waste_factor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fractional_sales_master_sku_id_fkey"
            columns: ["master_sku_id"]
            isOneToOne: false
            referencedRelation: "master_skus"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          alt_part_number: string | null
          brand_name: string | null
          created_at: string | null
          deleted: boolean | null
          department_id: number | null
          description_primary: string
          description_secondary: string | null
          id: number
          max_stock: number | null
          mfg_part_number: string | null
          min_order_qty: number | null
          min_stock: number | null
          part_number: string
          stock_on_hand: number | null
          unit_of_measure_id: number | null
          weight: number | null
        }
        Insert: {
          alt_part_number?: string | null
          brand_name?: string | null
          created_at?: string | null
          deleted?: boolean | null
          department_id?: number | null
          description_primary: string
          description_secondary?: string | null
          id?: never
          max_stock?: number | null
          mfg_part_number?: string | null
          min_order_qty?: number | null
          min_stock?: number | null
          part_number: string
          stock_on_hand?: number | null
          unit_of_measure_id?: number | null
          weight?: number | null
        }
        Update: {
          alt_part_number?: string | null
          brand_name?: string | null
          created_at?: string | null
          deleted?: boolean | null
          department_id?: number | null
          description_primary?: string
          description_secondary?: string | null
          id?: never
          max_stock?: number | null
          mfg_part_number?: string | null
          min_order_qty?: number | null
          min_stock?: number | null
          part_number?: string
          stock_on_hand?: number | null
          unit_of_measure_id?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      inventory_counts: {
        Row: {
          counted_by: string | null
          counted_quantity: number
          created_at: string | null
          discrepancy: number | null
          expected_quantity: number
          id: number
          notes: string | null
          product_id: number | null
          updated_at: string | null
        }
        Insert: {
          counted_by?: string | null
          counted_quantity: number
          created_at?: string | null
          discrepancy?: number | null
          expected_quantity: number
          id?: never
          notes?: string | null
          product_id?: number | null
          updated_at?: string | null
        }
        Update: {
          counted_by?: string | null
          counted_quantity?: number
          created_at?: string | null
          discrepancy?: number | null
          expected_quantity?: number
          id?: never
          notes?: string | null
          product_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_counts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_sync: {
        Row: {
          error_message: string | null
          id: number
          items_synced: number | null
          last_sync: string | null
          status: string | null
        }
        Insert: {
          error_message?: string | null
          id?: number
          items_synced?: number | null
          last_sync?: string | null
          status?: string | null
        }
        Update: {
          error_message?: string | null
          id?: number
          items_synced?: number | null
          last_sync?: string | null
          status?: string | null
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          id: number
          product_id: number
          quantity: number
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          id?: never
          product_id: number
          quantity: number
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          id?: never
          product_id?: number
          quantity?: number
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_transactions_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      item_classifications: {
        Row: {
          classification_id: number
          classification_level: number
          id: number
          part_number: string
        }
        Insert: {
          classification_id: number
          classification_level: number
          id?: never
          part_number: string
        }
        Update: {
          classification_id?: number
          classification_level?: number
          id?: never
          part_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_item_classifications_class"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_item_classifications_inventory"
            columns: ["part_number"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["part_number"]
          },
        ]
      }
      master_skus: {
        Row: {
          active: boolean
          adjustment_date: string | null
          adjustment_notes: string | null
          adjustment_quantity: number | null
          adjustment_type: string | null
          base_price: number | null
          created_at: string | null
          description: string | null
          full_unit_cost: number
          full_unit_quantity: number
          id: number
          location: string | null
          markup_percentage: number | null
          min_fraction_allowed: number
          product_id: number | null
          remaining_fraction: number
          unit_of_measure: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          adjustment_date?: string | null
          adjustment_notes?: string | null
          adjustment_quantity?: number | null
          adjustment_type?: string | null
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          full_unit_cost: number
          full_unit_quantity?: number
          id?: number
          location?: string | null
          markup_percentage?: number | null
          min_fraction_allowed?: number
          product_id?: number | null
          remaining_fraction?: number
          unit_of_measure: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          adjustment_date?: string | null
          adjustment_notes?: string | null
          adjustment_quantity?: number | null
          adjustment_type?: string | null
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          full_unit_cost?: number
          full_unit_quantity?: number
          id?: number
          location?: string | null
          markup_percentage?: number | null
          min_fraction_allowed?: number
          product_id?: number | null
          remaining_fraction?: number
          unit_of_measure?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "master_skus_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          price: number
          product_id: number
          quantity: number
        }
        Insert: {
          id?: never
          order_id: number
          price: number
          product_id: number
          quantity: number
        }
        Update: {
          id?: never
          order_id?: number
          price?: number
          product_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_order_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: number
          id: number
          order_date: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: number
          id?: never
          order_date?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: number
          id?: never
          order_date?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          id: number
          order_id: number
          payment_date: string | null
          payment_method: string
        }
        Insert: {
          amount: number
          id?: never
          order_id: number
          payment_date?: string | null
          payment_method: string
        }
        Update: {
          amount?: number
          id?: never
          order_id?: number
          payment_date?: string | null
          payment_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      price_levels: {
        Row: {
          id: number
          level_number: number
          margin: number | null
          part_number: string
          price: number
          quantity: number
          rounding_id: number | null
        }
        Insert: {
          id?: never
          level_number: number
          margin?: number | null
          part_number: string
          price: number
          quantity: number
          rounding_id?: number | null
        }
        Update: {
          id?: never
          level_number?: number
          margin?: number | null
          part_number?: string
          price?: number
          quantity?: number
          rounding_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_price_levels_inventory"
            columns: ["part_number"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["part_number"]
          },
        ]
      }
      pricing: {
        Row: {
          core_charge: number | null
          id: number
          market_cost: number | null
          net_price: number | null
          part_number: string
          tax_code: string | null
          taxable: boolean | null
          unit_cost: number | null
        }
        Insert: {
          core_charge?: number | null
          id?: never
          market_cost?: number | null
          net_price?: number | null
          part_number: string
          tax_code?: string | null
          taxable?: boolean | null
          unit_cost?: number | null
        }
        Update: {
          core_charge?: number | null
          id?: never
          market_cost?: number | null
          net_price?: number | null
          part_number?: string
          tax_code?: string | null
          taxable?: boolean | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pricing_inventory"
            columns: ["part_number"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["part_number"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          created_at: string | null
          id: number
          markup_percentage: number | null
          master_sku_id: number | null
          max_quantity: number | null
          min_quantity: number
          price_per_unit: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          markup_percentage?: number | null
          master_sku_id?: number | null
          max_quantity?: number | null
          min_quantity?: number
          price_per_unit: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          markup_percentage?: number | null
          master_sku_id?: number | null
          max_quantity?: number | null
          min_quantity?: number
          price_per_unit?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_master_sku_id_fkey"
            columns: ["master_sku_id"]
            isOneToOne: false
            referencedRelation: "master_skus"
            referencedColumns: ["id"]
          },
        ]
      }
      product_suppliers: {
        Row: {
          created_at: string | null
          id: number
          is_primary: boolean | null
          lead_time_days: number | null
          minimum_order_quantity: number | null
          product_id: number | null
          purchase_price: number | null
          supplier_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_primary?: boolean | null
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          product_id?: number | null
          purchase_price?: number | null
          supplier_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          is_primary?: boolean | null
          lead_time_days?: number | null
          minimum_order_quantity?: number | null
          product_id?: number | null
          purchase_price?: number | null
          supplier_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_suppliers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bin_location: string | null
          created_at: string | null
          department: string | null
          description: string | null
          id: number
          image: string | null
          last_counted_at: string | null
          last_ordered_at: string | null
          lead_time: number | null
          name: string
          par_level: number | null
          price: number
          purchase_price: number | null
          reorder_point: number | null
          safety_stock: number | null
          sku: string | null
          stock_quantity: number
          subcategory: string | null
          tags: string[] | null
          upc: string | null
          updated_at: string | null
        }
        Insert: {
          bin_location?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: never
          image?: string | null
          last_counted_at?: string | null
          last_ordered_at?: string | null
          lead_time?: number | null
          name: string
          par_level?: number | null
          price: number
          purchase_price?: number | null
          reorder_point?: number | null
          safety_stock?: number | null
          sku?: string | null
          stock_quantity: number
          subcategory?: string | null
          tags?: string[] | null
          upc?: string | null
          updated_at?: string | null
        }
        Update: {
          bin_location?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: never
          image?: string | null
          last_counted_at?: string | null
          last_ordered_at?: string | null
          lead_time?: number | null
          name?: string
          par_level?: number | null
          price?: number
          purchase_price?: number | null
          reorder_point?: number | null
          safety_stock?: number | null
          sku?: string | null
          stock_quantity?: number
          subcategory?: string | null
          tags?: string[] | null
          upc?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      sales_history: {
        Row: {
          id: number
          part_number: string
          quantity_sold: number | null
          recorded_at: string | null
          week_number: number
          year: number
        }
        Insert: {
          id?: never
          part_number: string
          quantity_sold?: number | null
          recorded_at?: string | null
          week_number: number
          year: number
        }
        Update: {
          id?: never
          part_number?: string
          quantity_sold?: number | null
          recorded_at?: string | null
          week_number?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_sales_history_inventory"
            columns: ["part_number"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["part_number"]
          },
        ]
      }
      seasonal_items: {
        Row: {
          id: number
          is_seasonal: boolean | null
          part_number: string
          season_end_date: string | null
          season_start_date: string | null
        }
        Insert: {
          id?: never
          is_seasonal?: boolean | null
          part_number: string
          season_end_date?: string | null
          season_start_date?: string | null
        }
        Update: {
          id?: never
          is_seasonal?: boolean | null
          part_number?: string
          season_end_date?: string | null
          season_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_seasonal_inventory"
            columns: ["part_number"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["part_number"]
          },
        ]
      }
      secrets: {
        Row: {
          created_at: string | null
          id: number
          key_name: string
          key_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          key_name: string
          key_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          key_name?: string
          key_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          id: number
          is_primary: boolean | null
          part_number: string | null
          supplier_number: number
          supplier_part_number: string | null
          supplier_ratio: number | null
        }
        Insert: {
          id?: never
          is_primary?: boolean | null
          part_number?: string | null
          supplier_number: number
          supplier_part_number?: string | null
          supplier_ratio?: number | null
        }
        Update: {
          id?: never
          is_primary?: boolean | null
          part_number?: string | null
          supplier_number?: number
          supplier_part_number?: string | null
          supplier_ratio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_suppliers_inventory"
            columns: ["part_number"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["part_number"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_fractional_sale: {
        Args: {
          p_master_sku_id: number
          p_product_id: number
          p_fraction_sold: number
          p_new_remaining_fraction: number
          p_new_stock_quantity: number
          p_sale_price: number
          p_cut_pattern?: string
          p_waste_factor?: number
          p_cut_notes?: string
        }
        Returns: undefined
      }
      update_sync_status: {
        Args: {
          p_status: string
          p_error_message?: string
          p_items_synced?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
