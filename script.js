document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById("cakeForm");
  const result = document.getElementById("formResult");
  const dateInput = document.getElementById("cakeDate");

  // Set the minimum selectable date to today using local calendar time.
  if (dateInput) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
    dateInput.min = localDate;
  }

  if (form && result) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const values = {
        name: data.get("customerName")?.trim() || "",
        email: data.get("customerEmail")?.trim() || "",
        cake: data.get("cakeType") || "",
        servings: data.get("servings") || "Not specified",
        occasion: data.get("occasion") || "Not specified",
        date: data.get("cakeDate") || "Not specified",
        details: data.get("cakeDetails")?.trim() || "No extra details provided."
      };

      // Use textContent rather than inserting user-entered values as HTML.
      result.replaceChildren();
      const heading = document.createElement("h3");
      heading.textContent = "Your enquiry summary";
      result.appendChild(heading);

      const lines = [
        ["Name", values.name],
        ["Email", values.email],
        ["Cake type", values.cake],
        ["Servings", values.servings],
        ["Occasion", values.occasion],
        ["Preferred date", values.date],
        ["Design or flavour ideas", values.details]
      ];

      lines.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;
        paragraph.append(strong, document.createTextNode(value));
        result.appendChild(paragraph);
      });

      const note = document.createElement("p");
      note.className = "small-note";
      note.textContent = "This is a demonstration only. Your enquiry has not been sent or saved.";
      result.appendChild(note);
      result.hidden = false;
      result.focus?.();
    });
  }

  // TheMealDB API: get a random dessert category result, then its full recipe.
  const button = document.getElementById("dessertButton");
  const status = document.getElementById("dessertStatus");
  const image = document.getElementById("dessertImage");
  const name = document.getElementById("dessertName");
  const category = document.getElementById("dessertCategory");
  const instructions = document.getElementById("dessertInstructions");
  const source = document.getElementById("dessertSource");

  if (button && status && image && name && category && instructions && source) {
    button.addEventListener("click", async () => {
      button.disabled = true;
      status.textContent = "Loading a dessert recipe…";
      source.hidden = true;

      try {
        const listResponse = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert");
        if (!listResponse.ok) throw new Error("Could not load dessert list.");
        const listData = await listResponse.json();
        const meals = listData.meals || [];
        if (!meals.length) throw new Error("No dessert recipes were returned.");

        const meal = meals[Math.floor(Math.random() * meals.length)];
        const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(meal.idMeal)}`);
        if (!detailResponse.ok) throw new Error("Could not load recipe details.");
        const detailData = await detailResponse.json();
        const recipe = detailData.meals?.[0];
        if (!recipe) throw new Error("Recipe details were unavailable.");

        name.textContent = recipe.strMeal || "Dessert recipe";
        category.textContent = (recipe.strCategory || "DESSERT").toUpperCase();
        const fullInstructions = (recipe.strInstructions || "No instructions are available.").replace(/\r/g, "");
        instructions.textContent = fullInstructions.length > 420
          ? `${fullInstructions.slice(0, 420).trim()}…`
          : fullInstructions;
        image.src = recipe.strMealThumb || "https://placehold.co/800x520/f2e9e1/604633?text=Dessert";
        image.alt = recipe.strMeal ? `Photo of ${recipe.strMeal}` : "Dessert recipe image";

        if (recipe.strSource && /^https?:\/\//i.test(recipe.strSource)) {
          source.href = recipe.strSource;
          source.hidden = false;
        } else {
          source.hidden = true;
        }
        status.textContent = "Recipe loaded successfully.";
      } catch (error) {
        status.textContent = "Sorry, the recipe could not load. Check your internet connection and try again.";
        console.error("Dessert API error:", error);
      } finally {
        button.disabled = false;
      }
    });
  }
});

/* CJ Bakes - JavaScript */

// 1. Handle the cake enquiry form
const cakeForm = document.getElementById("cakeForm");
const formResult = document.getElementById("formResult");

cakeForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("customerName").value;
  const cake = document.getElementById("cakeType").value;

  formResult.textContent =
    "Thank you, " + name + "! Your enquiry is for a " +
    cake + ". This is a demo and your enquiry has not been sent.";
});


// 2. Get a dessert recipe using TheMealDB API
const dessertButton = document.getElementById("dessertButton");
const dessertResult = document.getElementById("dessertResult");

dessertButton.addEventListener("click", async function() {
  dessertResult.textContent = "Loading a recipe...";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    if (!response.ok) {
      throw new Error("Could not get a recipe");
    }

    const data = await response.json();
    const recipe = data.meals[0];

    dessertResult.textContent =
      "Recipe idea: " + recipe.strMeal +
      ". Category: " + recipe.strCategory + ".";

  } catch (error) {
    dessertResult.textContent =
      "Sorry, the recipe could not load. Please try again.";
  }
});
