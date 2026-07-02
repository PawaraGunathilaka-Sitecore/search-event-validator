import type { EventSpec, SchemaNode } from "../types";

const eventSpecsBase: Record<string, EventSpec> = {
  "Widget Click for Preview Search": {
    sample: {
      action: "click",
      action_cause: "entity",
      ckey: "11278-26912670771",
      client_time_ms: 1776286204181,
      name: "widget",
      server_time_ms: 1776286204312,
      uid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      uuid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      value: {
        context: {
          browser: { user_agent: "Mozilla/5.0" },
          geo: { ip: "52.204.214.196" },
          page: { uri: "/" },
        },
        entities: [{ entity_type: "product", id: "04401493" }],
        rfk_id: "rfkid_6",
      },
    },
    schema: {
      type: "object",
      required: {
        action: { type: "string", equals: "click" },
        action_cause: { type: "string", equals: "entity" },
        ckey: { type: "string" },
        client_time_ms: { type: "number" },
        name: { type: "string", equals: "widget" },
        server_time_ms: { type: "number" },
        uid: { type: "string" },
        uuid: { type: "string" },
        value: {
          type: "object",
          required: {
            context: {
              type: "object",
              required: {
                browser: {
                  type: "object",
                  required: { user_agent: { type: "string" } },
                },
                geo: { type: "object", required: { ip: { type: "string" } } },
                page: { type: "object", required: { uri: { type: "string" } } },
              },
            },
            entities: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  entity_type: { type: "string", equals: "product" },
                  id: { type: "string" },
                },
              },
            },
            rfk_id: { type: "string" },
          },
        },
      },
    },
  },
  "Widget View for Preview Search": {
    sample: {
      action: "view",
      ckey: "11278-26912670771",
      client_time_ms: 1776284952089,
      name: "widget",
      server_time_ms: 1776284952169,
      uid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      uuid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      value: {
        context: {
          browser: { user_agent: "Mozilla/5.0" },
          geo: { ip: "52.204.214.196" },
          page: { uri: "/" },
        },
        entities: [
          { entity_type: "category", id: "5628" },
          { entity_type: "product", id: "03518388" },
        ],
        rfk_id: "rfkid_6",
      },
    },
    schema: {
      type: "object",
      required: {
        action: { type: "string", equals: "view" },
        ckey: { type: "string" },
        client_time_ms: { type: "number" },
        name: { type: "string", equals: "widget" },
        server_time_ms: { type: "number" },
        uid: { type: "string" },
        uuid: { type: "string" },
        value: {
          type: "object",
          required: {
            context: {
              type: "object",
              required: {
                browser: {
                  type: "object",
                  required: { user_agent: { type: "string" } },
                },
                geo: { type: "object", required: { ip: { type: "string" } } },
                page: { type: "object", required: { uri: { type: "string" } } },
              },
            },
            entities: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  entity_type: {
                    type: "string",
                    oneOf: ["category", "product"],
                  },
                  id: { type: "string" },
                },
              },
            },
            rfk_id: { type: "string" },
          },
        },
      },
    },
  },
  "Request for Preview Search": {
    sample: {
      context: {
        page: { uri: "/" },
        user: {
          uuid: "203148695-0e-n9-4f-1p-maszjq6gzwiehcvd1vkf-1776352897368",
          custom: {},
        },
        browser: { user_agent: "Mozilla/5.0" },
        store: { group_id: "PSP_Buyer", id: "4557" },
        ids: { store: ["4557"] },
      },
      ordercloud: { sellerId: "4557", requiredInventoryLocations: ["*-4557"] },
      widget: {
        items: [
          {
            rfk_id: "rfkid_6",
            search: {
              content: {},
              suggestion: [
                {
                  name: "auto_name_suggestion",
                  keyphrase_fallback: true,
                  max: 5,
                },
                { name: "recent_history", keyphrase_fallback: true, max: 5 },
              ],
              query: { keyphrase: "red" },
            },
            entity: "product",
          },
        ],
      },
    },
    schema: {
      type: "object",
      required: {
        context: {
          type: "object",
          required: {
            page: { type: "object", required: { uri: { type: "string" } } },
            user: {
              type: "object",
              required: {
                uuid: { type: "string" },
                custom: { type: "object" },
              },
            },
            browser: {
              type: "object",
              required: { user_agent: { type: "string" } },
            },
            store: {
              type: "object",
              required: {
                group_id: { type: "string" },
                id: { type: "string" },
              },
            },
            ids: { type: "object", required: { store: { type: "array" } } },
          },
        },
        ordercloud: {
          type: "object",
          required: {
            sellerId: { type: "string" },
            requiredInventoryLocations: { type: "array", minItems: 1 },
          },
        },
        widget: {
          type: "object",
          required: {
            items: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  rfk_id: { type: "string" },
                  search: {
                    type: "object",
                    required: {
                      content: { type: "object" },
                      suggestion: {
                        type: "array",
                        minItems: 1,
                        itemSchema: {
                          type: "object",
                          required: {
                            name: { type: "string" },
                            keyphrase_fallback: { type: "boolean" },
                            max: { type: "number" },
                          },
                        },
                      },
                      query: {
                        type: "object",
                        required: { keyphrase: { type: "string" } },
                      },
                    },
                  },
                  entity: { type: "string", equals: "product" },
                },
              },
            },
          },
        },
      },
    },
  },
  "Widget Click for Full Page Search": {
    sample: {
      action: "click",
      action_cause: "entity",
      ckey: "11278-26912670771",
      client_time_ms: 1776287241600,
      name: "widget",
      server_time_ms: 1776287241745,
      uid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      uuid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      value: {
        context: {
          browser: { user_agent: "Mozilla/5.0" },
          geo: { ip: "52.204.214.196" },
          page: { uri: "/catalog/search.scmd" },
        },
        entities: [{ entity_type: "product", id: "03658721" }],
        rfk_id: "rfkid_7",
      },
    },
    schema: null,
  },
  "Widget View for Full Page Search": {
    sample: {
      action: "view",
      ckey: "11278-26912670771",
      client_time_ms: 1776286673899,
      name: "widget",
      server_time_ms: 1776286674043,
      uid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      uuid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      value: {
        context: {
          browser: { user_agent: "Mozilla/5.0" },
          geo: { ip: "52.204.214.196" },
          page: { uri: "/catalog/search.scmd" },
        },
        entities: [{ entity_type: "product", id: "03658721" }],
        request: { keyword: "toy cleaner" },
        rfk_id: "rfkid_7",
      },
    },
    schema: {
      type: "object",
      required: {
        action: { type: "string", equals: "view" },
        ckey: { type: "string" },
        client_time_ms: { type: "number" },
        name: { type: "string", equals: "widget" },
        server_time_ms: { type: "number" },
        uid: { type: "string" },
        uuid: { type: "string" },
        value: {
          type: "object",
          required: {
            context: {
              type: "object",
              required: {
                browser: {
                  type: "object",
                  required: { user_agent: { type: "string" } },
                },
                geo: { type: "object", required: { ip: { type: "string" } } },
                page: { type: "object", required: { uri: { type: "string" } } },
              },
            },
            entities: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  entity_type: { type: "string", equals: "product" },
                  id: { type: "string" },
                },
              },
            },
            request: {
              type: "object",
              required: {
                keyword: { type: "string" },
              },
            },
            rfk_id: { type: "string" },
          },
        },
      },
    },
  },
  "Request for Full Page Search": {
    sample: {
      context: {
        page: { uri: "/search" },
        user: {
          uuid: "203148695-0e-n9-4f-1p-maszjq6gzwiehcvd1vkf-1776352897368",
          custom: {},
        },
        browser: { user_agent: "Mozilla/5.0" },
        store: { group_id: "PSP_Buyer", id: "4557" },
        ids: { product: [] },
      },
      ordercloud: { sellerId: "4557", requiredInventoryLocations: ["*-4557"] },
      widget: {
        items: [
          {
            rfk_id: "rfkid_7",
            search: {
              content: {},
              facet: { all: true },
              offset: 0,
              sort: { choices: true, value: [{ name: "default" }] },
              limit: 24,
              query: { keyphrase: "red", operator: "or" },
              suggestion: [
                {
                  name: "auto_name_suggestion",
                  keyphrase_fallback: true,
                  max: 5,
                },
                { name: "recent_history", keyphrase_fallback: true, max: 5 },
              ],
              response_context: {},
            },
            entity: "product",
          },
        ],
      },
    },
    schema: {
      type: "object",
      required: {
        context: {
          type: "object",
          required: {
            page: { type: "object", required: { uri: { type: "string" } } },
            user: {
              type: "object",
              required: {
                uuid: { type: "string" },
                custom: { type: "object" },
              },
            },
            browser: {
              type: "object",
              required: { user_agent: { type: "string" } },
            },
            store: {
              type: "object",
              required: {
                group_id: { type: "string" },
                id: { type: "string" },
              },
            },
            ids: { type: "object", required: { product: { type: "array" } } },
          },
        },
        ordercloud: {
          type: "object",
          required: {
            sellerId: { type: "string" },
            requiredInventoryLocations: { type: "array", minItems: 1 },
          },
        },
        widget: {
          type: "object",
          required: {
            items: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  rfk_id: { type: "string" },
                  search: {
                    type: "object",
                    required: {
                      content: { type: "object" },
                      facet: {
                        type: "object",
                        required: { all: { type: "boolean" } },
                      },
                      offset: { type: "number" },
                      sort: {
                        type: "object",
                        required: {
                          choices: { type: "boolean" },
                          value: {
                            type: "array",
                            minItems: 1,
                            itemSchema: {
                              type: "object",
                              required: {
                                name: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                      limit: { type: "number" },
                      query: {
                        type: "object",
                        required: {
                          keyphrase: { type: "string" },
                          operator: { type: "string" },
                        },
                      },
                      suggestion: {
                        type: "array",
                        minItems: 1,
                        itemSchema: {
                          type: "object",
                          required: {
                            name: { type: "string" },
                            keyphrase_fallback: { type: "boolean" },
                            max: { type: "number" },
                          },
                        },
                      },
                      response_context: { type: "object" },
                    },
                  },
                  entity: { type: "string", equals: "product" },
                },
              },
            },
          },
        },
      },
    },
  },
  "Widget Click for PLP": {
    sample: {
      action: "click",
      action_cause: "entity",
      ckey: "11278-26912670771",
      client_time_ms: 1776288381368,
      name: "widget",
      server_time_ms: 1776288381531,
      uid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      uuid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      value: {
        context: {
          browser: { user_agent: "Mozilla/5.0" },
          geo: { ip: "52.204.214.196" },
          page: { uri: "/category/sample" },
        },
        entities: [{ entity_type: "product", id: "04421533" }],
        rfk_id: "rfkid_10",
      },
    },
    schema: null,
  },
  "Widget View for PLP": {
    sample: {
      action: "view",
      ckey: "11278-26912670771",
      client_time_ms: 1776287682232,
      name: "widget",
      server_time_ms: 1776287682495,
      uid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      uuid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      value: {
        context: {
          browser: { user_agent: "Mozilla/5.0" },
          geo: { ip: "52.204.214.196" },
          page: { uri: "/category/sample" },
        },
        entities: [{ entity_type: "product", id: "03813789" }],
        rfk_id: "rfkid_10",
      },
    },
    schema: {
      type: "object",
      required: {
        action: { type: "string", equals: "view" },
        ckey: { type: "string" },
        client_time_ms: { type: "number" },
        name: { type: "string", equals: "widget" },
        server_time_ms: { type: "number" },
        uid: { type: "string" },
        uuid: { type: "string" },
        value: {
          type: "object",
          required: {
            context: {
              type: "object",
              required: {
                browser: {
                  type: "object",
                  required: { user_agent: { type: "string" } },
                },
                geo: { type: "object", required: { ip: { type: "string" } } },
                page: { type: "object", required: { uri: { type: "string" } } },
              },
            },
            entities: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  entity_type: { type: "string", equals: "product" },
                  id: { type: "string" },
                },
              },
            },
            rfk_id: { type: "string" },
          },
        },
      },
    },
  },
  "Request for Full PLP": {
    sample: {
      context: {
        page: { uri: "/Dog/Food/Freeze-Dried-Dehydrated-Food" },
        user: {
          uuid: "203148695-0e-n9-4f-1p-maszjq6gzwiehcvd1vkf-1776352897368",
          custom: {},
        },
        browser: { user_agent: "Mozilla/5.0" },
        store: { group_id: "PSP_Buyer", id: "4557" },
        ids: { product: [] },
      },
      widget: {
        items: [
          {
            rfk_id: "rfkid_10",
            search: {
              content: {},
              facet: { all: true },
              offset: 0,
              sort: { choices: true, value: [{ name: "default" }] },
              limit: 24,
              suggestion: [
                {
                  name: "auto_name_suggestion",
                  keyphrase_fallback: true,
                  max: 5,
                },
                { name: "recent_history", keyphrase_fallback: true, max: 5 },
              ],
              response_context: {},
              query: { operator: "or" },
            },
            entity: "product",
          },
        ],
      },
    },
    schema: {
      type: "object",
      required: {
        context: {
          type: "object",
          required: {
            page: { type: "object", required: { uri: { type: "string" } } },
            user: {
              type: "object",
              required: {
                uuid: { type: "string" },
                custom: { type: "object" },
              },
            },
            browser: {
              type: "object",
              required: { user_agent: { type: "string" } },
            },
            store: {
              type: "object",
              required: {
                group_id: { type: "string" },
                id: { type: "string" },
              },
            },
            ids: { type: "object", required: { product: { type: "array" } } },
          },
        },
        widget: {
          type: "object",
          required: {
            items: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  rfk_id: { type: "string" },
                  search: {
                    type: "object",
                    required: {
                      content: { type: "object" },
                      facet: {
                        type: "object",
                        required: { all: { type: "boolean" } },
                      },
                      offset: { type: "number" },
                      sort: {
                        type: "object",
                        required: {
                          choices: { type: "boolean" },
                          value: {
                            type: "array",
                            minItems: 1,
                            itemSchema: {
                              type: "object",
                              required: {
                                name: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                      limit: { type: "number" },
                      suggestion: {
                        type: "array",
                        minItems: 1,
                        itemSchema: {
                          type: "object",
                          required: {
                            name: { type: "string" },
                            keyphrase_fallback: { type: "boolean" },
                            max: { type: "number" },
                          },
                        },
                      },
                      response_context: { type: "object" },
                      query: {
                        type: "object",
                        required: {
                          operator: { type: "string" },
                        },
                      },
                    },
                  },
                  entity: { type: "string", equals: "product" },
                },
              },
            },
          },
        },
      },
    },
  },
  "Add to Cart Event": {
    sample: {
      action: "add",
      action_sub_type: "conversion",
      ckey: "11278-26912670771",
      client_time_ms: 1776289238027,
      name: "cart",
      server_time_ms: 1776289238163,
      uid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      uuid: "26912670771-spn-spt-tz-fs-H3Aj0tEv0m99S3ioXNgd-1775839180312",
      value: {
        context: {
          browser: { user_agent: "Mozilla/5.0" },
          geo: { ip: "52.204.214.196" },
          page: { uri: "/product/item" },
        },
        entities: [{ entity_type: "product", id: "04421533" }],
      },
    },
    schema: {
      type: "object",
      required: {
        action: { type: "string", equals: "add" },
        action_sub_type: { type: "string", equals: "conversion" },
        ckey: { type: "string" },
        client_time_ms: { type: "number" },
        name: { type: "string", equals: "cart" },
        server_time_ms: { type: "number" },
        uid: { type: "string" },
        uuid: { type: "string" },
        value: {
          type: "object",
          required: {
            context: {
              type: "object",
              required: {
                browser: {
                  type: "object",
                  required: { user_agent: { type: "string" } },
                },
                geo: { type: "object", required: { ip: { type: "string" } } },
                page: { type: "object", required: { uri: { type: "string" } } },
              },
            },
            entities: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  entity_type: { type: "string", equals: "product" },
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "Order Confirmation Event": {
    sample: {
      client_time_ms: 1775846876534,
      name: "order_confirm",
      action: "add",
      uuid: "26912670771-spn-spt-tz-fs-glyhGahQ0AZ6KqTNUoMz-1775840892110",
      value: {
        entities: [{ entity_type: "product", id: "03243276" }],
        context: {
          geo: { ip: "127.0.0.1" },
          browser: { user_agent: "Mozilla/5.0" },
          page: { uri: "checkout.jsp" },
        },
        transaction: {
          order_total: "$37.98",
          order_subtotal: "$24.99",
          order_id: "400002616",
        },
      },
      action_sub_type: "conversion",
    },
    schema: {
      type: "object",
      required: {
        client_time_ms: { type: "number" },
        name: { type: "string", equals: "order_confirm" },
        action: { type: "string", equals: "add" },
        uuid: { type: "string" },
        action_sub_type: { type: "string", equals: "conversion" },
        value: {
          type: "object",
          required: {
            entities: {
              type: "array",
              minItems: 1,
              itemSchema: {
                type: "object",
                required: {
                  entity_type: { type: "string", equals: "product" },
                  id: { type: "string" },
                },
              },
            },
            context: {
              type: "object",
              required: {
                geo: { type: "object", required: { ip: { type: "string" } } },
                browser: {
                  type: "object",
                  required: { user_agent: { type: "string" } },
                },
                page: { type: "object", required: { uri: { type: "string" } } },
              },
            },
            transaction: {
              type: "object",
              required: {
                order_total: { type: "string" },
                order_subtotal: { type: "string" },
                order_id: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

eventSpecsBase["Widget Click for Full Page Search"].schema = JSON.parse(
  JSON.stringify(eventSpecsBase["Widget Click for Preview Search"].schema),
) as SchemaNode;

eventSpecsBase["Widget Click for PLP"].schema = JSON.parse(
  JSON.stringify(eventSpecsBase["Widget Click for Preview Search"].schema),
) as SchemaNode;

export const eventSpecs = eventSpecsBase;
export const eventTypeNames = Object.keys(eventSpecsBase);
