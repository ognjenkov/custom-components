import classNames from "classnames";

import {
  Errors,
  FormContext,
  Description,
  Label,
  Select,
} from "@bpmn-io/form-js";
import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import { html, useContext } from "diagram-js/lib/ui";

export const customSelectType = "custom-select";
import "./styles.css";

export function CustomSelect(props) {
  console.log("CustomSelect props", props);
  const { disabled, errors = [], field, readonly } = props;
  const {
    description,
    id,
    label,
    validate = {},
    searchableSelect = {},
  } = field;
  const { required } = validate;
  const { url } = searchableSelect;
  const componentRef = useRef < HTMLDivElement > null;
  const { formId } = useContext(FormContext);

  const errorMessageId =
    errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollLocked, setScrollLocked] = useState(false);
  //TO DO: accept url from field params
  const urlFetch = url ?? "http://universities.hipolabs.com/search";

  const onScrollEnd = async () => {
    if (scrollLocked || !urlFetch) return;
    const response = await fetch(
      `${urlFetch}?search=${search}&page=${currentPage + 1}&size=10`
    );
    const data = await response.json();
    if (data && data instanceof Array) {
      if (data.length === 0) {
        setScrollLocked(true);
      }
      setCurrentPage(currentPage + 1);
      setOptions((prev) => [...prev, ...data]);
    } else {
      setScrollLocked(true);
    }
  };
  const fetchOptions = async (query) => {
    if (!urlFetch) return;
    const response = await fetch(`${urlFetch}?search=${query}&page=1&size=10`);
    const data = await response.json();
    data && data instanceof Array ? setOptions(data) : setOptions([]);
    setScrollLocked(false);
    setCurrentPage(1);
  };

  const scrollTimeoutRef = useRef(null);

  const onScroll = (e) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const scrolledRatio = (scrollTop + clientHeight) / scrollHeight;

    if (scrolledRatio >= 0.8) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        onScrollEnd();
      }, 300);
    }
  };

  useEffect(() => {
    if (search.length >= 2) {
      const delay = setTimeout(() => {
        fetchOptions(search);
        setShowOptions(true);
      }, 300);

      return () => clearTimeout(delay);
    } else {
      setShowOptions(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // const handleChange = (e) => {
  //   console.log(e)
  //   props.onChange({ field, value: e.target.value })
  // }

  const handleSelect = (value) => {
    setSearch(value.value);
    props.onChange({ field, value });
    setShowOptions(false);
  };

  const toggleDropdown = () => {
    if (!readonly) setShowOptions((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return html`<div
    ref=${componentRef}
    class=${formFieldClasses(customSelectType, { errors, disabled, readonly })}
  >
    <${Label}
      class="fjs-form-field-label"
      label=${label}
      required=${required}
    />
    <div class="fjs-input-group">
      <input
        type="text"
        value=${search || ""}
        class="custom-select fjs-input"
        disabled=${disabled || readonly}
        onChange=${(e) => {
          setSearch(e.target.value);
          //setShowOptions(false)
        }}
        onClick=${toggleDropdown}
        placeholder="Type to search..."
      />
      ${showOptions &&
      html`<ul onScroll=${onScroll} className="options-list">
        ${options.map(
          (option) =>
            html`<li
              key=${option.key}
              class="option-item"
              onClick=${() => handleSelect(option)}
            >
              ${option.value}
            </li>`
        )}
      </ul>`}
    </div>
    <${Description} description=${description} />
    <${Errors} errors=${errors} id=${errorMessageId} />
  </div>`;
}

/*
 * This is the configuration part of the custom field. It defines
 * the schema type, UI label and icon, palette group, properties panel entries
 * and much more.
 */
CustomSelect.config = {
  /* we can extend the default configuration of existing fields */
  ...Select.config,
  type: customSelectType,
  label: "Custom select",
  defaultValue: null,
  organization: "",
  taskId: "",
  iconUrl: "https://cdn-icons-png.flaticon.com/128/561/561123.png",
  propertiesPanelEntries: [
    "key",
    "label",
    "description",
    "disabled",
    "readonly",
  ],
};

// helper //////////////////////

function formFieldClasses(
  type,
  { errors = [], disabled = false, readonly = false } = {}
) {
  if (!type) {
    throw new Error("type required");
  }

  return classNames("fjs-form-field", `fjs-form-field-${type}`, {
    "fjs-has-errors": errors.length > 0,
    "fjs-disabled": disabled,
    "fjs-readonly": readonly,
  });
}

function prefixId(id, formId) {
  if (formId) {
    return `fjs-form-${formId}-${id}`;
  }

  return `fjs-form-${id}`;
}
////////////////////////////////////////////
/// https://sv-om.free.beeceptor.com/orders?search=<text>&page=<page>&size=<size>
////////////////////////////////////////////
