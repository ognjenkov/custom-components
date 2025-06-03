import { get, set } from "min-dash";
import {
  FeelTemplatingEntry,
  isFeelEntryEdited,
} from "@bpmn-io/properties-panel";
import { useVariables } from "@bpmn-io/form-js";

export class CustomPropertiesProvider {
  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this, 500);
  }

  getGroups(field, editField) {
    console.log("CustomPropertiesProvider active for field:", field);
    return (groups) => {
      if (field.type !== "custom-select") return groups;
      console.log("if je false");
      const generalIdx = findGroupIdx(groups, "general");

      groups.splice(generalIdx + 1, 0, {
        id: "searchableSelect",
        label: "Searchable Select",
        entries: SearchableSelectEntries(field, editField),
      });

      return groups;
    };
  }
}

CustomPropertiesProvider.$inject = ["propertiesPanel"];

function SearchableSelectEntries(field, editField) {
  // const onChange = (key) => {
  //   return (value) => {
  //     editField(field, [ key ], value);
  //   };
  // };

  // const getValue = (key) => {
  //   return () => {
  //     return get(field, [ key ]);
  //   };
  // };

  const onChange = (key) => {
    return (value) => {
      const range = get(field, ["searchableSelect"], {});

      editField(field, ["searchableSelect"], set(range, [key], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, ["searchableSelect", key]);
    };
  };

  return [
    {
      id: "searchableSelect-url",
      component: UrlEntry,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
    },
  ];
}

function UrlEntry(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = (fn) => fn;

  const variables = useVariables().map((name) => ({ name }));

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue: getValue("url"),
    id,
    label: "URL",
    setValue: onChange("url"),
    variables,
  });
}


// Helper function
function findGroupIdx(groups, id) {
  console.log("findGroupIdx", groups, id);
  return groups.findIndex((group) => group.id === id);
}
