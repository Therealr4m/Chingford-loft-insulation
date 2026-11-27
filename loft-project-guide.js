


/* =========================================
   LOFT INSULATION PROJECT GUIDE
========================================= */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loftGuideForm");

  if (!form) return;

  const area = document.getElementById("lgArea");
  const unknownArea = document.getElementById("lgUnknownArea");
  const depth = document.getElementById("lgDepth");
  const condition = document.getElementById("lgCondition");
  const boarding = document.getElementById("lgBoarding");
  const access = document.getElementById("lgAccess");
  const reason = document.getElementById("lgReason");

  const output = document.getElementById("loftGuideOutput");
  const placeholder = document.getElementById("loftGuidePlaceholder");
  const results = document.getElementById("loftGuideResults");

  const resultArea = document.getElementById("lgResultArea");
  const resultDepth = document.getElementById("lgResultDepth");
  const depthResultBox = document.getElementById("lgDepthResultBox");
  const resultService = document.getElementById("lgResultService");
  const resultAdvice = document.getElementById("lgResultAdvice");

  /* Unknown loft area */
  function syncArea() {
    area.disabled = unknownArea.checked;
    area.required = !unknownArea.checked;
  }

  unknownArea.addEventListener("change", syncArea);
  syncArea();

  /* Prevent contradictory insulation selections */
  function syncCondition() {
    const noInsulationOption =
      condition.querySelector('option[value="none"]');

    if (depth.value === "none") {
      noInsulationOption.disabled = false;
      condition.value = "none";
      condition.disabled = true;
    } else {
      condition.disabled = false;
      noInsulationOption.disabled = true;

      if (condition.value === "none") {
        condition.value = "";
      }
    }
  }

  depth.addEventListener("change", syncCondition);
  syncCondition();

  /* Generate project guide */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const loftArea = Number(area.value);
    const existingDepth = depth.value;
    const existingCondition = condition.value;
    const loftBoarding = boarding.value;
    const loftAccess = access.value;
    const mainReason = reason.value;

    let service = "";
    let additionalDepth = "";
    const advice = [];

    /* Loft area */
    if (unknownArea.checked) {
      resultArea.textContent = "Not measured";
    } else {
      if (!Number.isFinite(loftArea) || loftArea < 1) {
        return;
      }

      resultArea.textContent = loftArea.toFixed(2) + " m²";
    }

    /* Potential project requirement */
    if (existingCondition === "damp") {
      service = "Moisture Investigation";

      advice.push(
        "The source of moisture should be identified and resolved before additional insulation is installed. Damp materials may require removal or replacement."
      );
    } else if (existingCondition === "damaged") {
      service = "Insulation Replacement Assessment";

      advice.push(
        "Damaged insulation should be assessed to determine whether removal and replacement are necessary before new materials are installed."
      );
    } else if (existingCondition === "compressed") {
      service = "Insulation Condition Assessment";

      advice.push(
        "Compressed insulation may have reduced thermal performance. Its condition and effective depth should be assessed before further insulation is added."
      );
    } else if (existingDepth === "none") {
      service = "Full Loft Insulation Installation";
      additionalDepth = "270 mm";

      advice.push(
        "A new insulation installation may be suitable, with consistent coverage across the accessible loft floor and around appropriate obstructions."
      );
    } else if (existingDepth === "full") {
      service = "Existing Insulation Assessment";

      advice.push(
        "Additional insulation may not be necessary if the existing material provides adequate thermal performance and consistent coverage."
      );
    } else {
      service = "Loft Insulation Top-Up";

      advice.push(
        "Existing insulation in good condition may be retained and topped up rather than completely removed and replaced."
      );

      const depthEstimates = {
        low: "Over 170–270 mm",
        medium: "71–170 mm",
        high: "1–70 mm"
      };

      additionalDepth = depthEstimates[existingDepth] || "";
    }

    /* Additional depth result */
    if (additionalDepth) {
      resultDepth.textContent = additionalDepth;
      depthResultBox.hidden = false;
    } else {
      resultDepth.textContent = "";
      depthResultBox.hidden = true;
    }

    /* Boarding considerations */
    if (loftBoarding === "full") {
      advice.push(
        "Existing loft boarding may need lifting or raising to accommodate additional insulation without compressing the material."
      );
    } else if (loftBoarding === "partial") {
      advice.push(
        "Partially boarded areas may require adjustments to achieve consistent insulation coverage across the loft floor."
      );
    } else {
      advice.push(
        "An unboarded loft generally provides more direct access to the insulation area, subject to suitable and safe working conditions."
      );
    }

    /* Access considerations */
    if (loftAccess === "restricted") {
      advice.push(
        "Restricted loft hatch access may affect how insulation materials and equipment are transported into the loft."
      );
    } else {
      advice.push(
        "Loft hatch dimensions and safe working access should be checked before installation begins."
      );
    }

    /* Main homeowner concern */
    if (mainReason === "cold") {
      advice.push(
        "Insulation coverage, gaps, draughts and other sources of heat loss should be considered when addressing cold rooms."
      );
    } else if (mainReason === "bills") {
      advice.push(
        "Improving insufficient loft insulation may reduce heat loss, although energy savings depend on the property and heating usage."
      );
    } else if (mainReason === "replacement") {
      advice.push(
        "The condition and performance of existing insulation should determine whether replacement is necessary, rather than age alone."
      );
    } else {
      advice.push(
        "Consistent insulation coverage can help reduce heat loss through the ceiling and improve the property's thermal efficiency."
      );
    }

    /* General installation considerations */
    advice.push(
      "Suitable loft ventilation must be maintained, with consideration given to electrical fittings, cables, pipework and other services."
    );

    /* Display personalised results */
    resultService.textContent = service;
    resultAdvice.replaceChildren();

    advice.forEach(function (point) {
      const item = document.createElement("li");
      item.textContent = point;
      resultAdvice.appendChild(item);
    });

    placeholder.hidden = true;
    results.hidden = false;
    output.classList.add("loft-guide-generated");

    /* Mobile result navigation */
    if (window.matchMedia("(max-width: 760px)").matches) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      output.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  });
});