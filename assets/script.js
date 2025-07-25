// script.js

let currentLanguage = localStorage.getItem("language")
if (!currentLanguage) {
  currentLanguage = window.navigator.language.includes("de") ? "de" : "en"
  localStorage.setItem("language", currentLanguage)
}
let currentMode = localStorage.getItem("mode")
if (!currentMode) {
  currentMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
  localStorage.setItem("mode", currentMode)
}

// dark mode toggle
const setInitialMode = () => {
  if (currentMode === "dark") {
    document.body.classList.remove("light-mode")
    document.body.classList.add("dark-mode")
    document.querySelector(".mode-switcher").classList.remove("day")
    document.querySelector(".mode-switcher .moon").classList.remove("sun")
  } else {
    document.body.classList.add("light-mode")
    document.body.classList.remove("dark-mode")
    document.querySelector(".mode-switcher").classList.add("day")
    document.querySelector(".mode-switcher .moon").classList.add("sun")
  }
}

const toggleMode = () => {
  currentMode = currentMode === "light" ? "dark" : "light"
  localStorage.setItem("mode", currentMode)
  document.body.classList.toggle("light-mode")
  document.body.classList.toggle("dark-mode")
  document.querySelector(".mode-switcher").classList.toggle("day")
  document.querySelector(".mode-switcher .moon").classList.toggle("sun")
}

// loading language files dynamically
loadLanguage = async (lang, save = true) => {
  if (save) localStorage.setItem("language", lang)

  const response = await fetch(`i18n/${lang}/${lang}.json`)
  const translations = await response.json()

  document.documentElement.lang = lang
  if (translations.website.page_language)
    document
      .querySelector('meta[name="language"]')
      .setAttribute("content", translations.website.page_language)
  if (translations.website.page_title)
    document.title = translations.website.page_title
  if (translations.website.page_description)
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", translations.website.page_description)
  if (translations.website.page_keywords)
    document
      .querySelector('meta[name="keywords"]')
      .setAttribute("content", translations.website.page_keywords)

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n")
    if (translations.website[key]) {
      el.innerHTML = translations.website[key]
    }
  })

  setPreviewImages()
}

// set preview images
const setPreviewImages = () => {
  const lang = localStorage.getItem("language") || "en"
  const previewLightImage = document.querySelector(".preview-flyer-light img")
  const previewDarkImage = document.querySelector(".preview-flyer-dark img")
  previewLightImage.src = `./i18n/${lang}/preview-flyer-light.webp`
  previewDarkImage.src = `./i18n/${lang}/preview-flyer-dark.webp`
  previewLightImage.alt = `Preview flyer in light mode (${lang})`
  previewDarkImage.alt = `Preview flyer in dark mode (${lang})`
  const previewLightPdfLinks = document.querySelectorAll(
    ".preview-flyer-light a"
  )
  const previewDarkPdfLinks = document.querySelectorAll(".preview-flyer-dark a")
  previewLightPdfLinks.forEach((link) => {
    link.href = `./i18n/${lang}/flyer-light-${lang}.pdf`
  })
  previewDarkPdfLinks.forEach((link) => {
    link.href = `./i18n/${lang}/flyer-dark-${lang}.pdf`
  })
}

// sorting
const categoryOrder = {
  comfort: ["cex", "kyc_light", "atomic", "no_kyc", "dex"],
  privacy: ["atomic", "dex", "no_kyc", "kyc_light", "cex"],
}

const sortCategories = (mode) => {
  const exchanges = document.querySelector("#exchanges")
  const blocks = {}

  for (const id of Object.values(categoryOrder.comfort)) {
    const h2 = document.getElementById(id)
    const p = document.getElementById(id + "-desc")
    const div = h2.nextElementSibling.nextElementSibling
    blocks[id] = [h2, p, div]
  }

  for (const block of Object.values(blocks).flat()) {
    exchanges.removeChild(block)
  }

  for (const id of categoryOrder[mode]) {
    for (const el of blocks[id]) {
      exchanges.appendChild(el)
    }
  }

  localStorage.setItem("sortMode", mode)
}

// initial
document.addEventListener("DOMContentLoaded", () => {
  // mode
  setInitialMode()

  // language
  const savedLang = localStorage.getItem("language")
  const browserLang = navigator.language.slice(0, 2)
  const lang = savedLang || browserLang
  loadLanguage(lang, true)
  // set option with value="lang" as selected
  const langSwitcher = document.querySelector(".language-switcher")
  langSwitcher.querySelectorAll("option").forEach((option) => {
    if (option.value === lang) {
      option.selected = true
    }
  })

  // preview images
  setPreviewImages()

  // sorting
  const savedSort = localStorage.getItem("sortMode") || "comfort"
  const hasSorting = document.getElementById("sort-mode")
  if (hasSorting) {
    document.getElementById("sort-mode").value = savedSort
    sortCategories(savedSort)
  }
})

// current year
document.getElementById("current-year").textContent = new Date().getFullYear()

// micro animation
const elements = document.querySelectorAll(".fade-in")
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
})
elements.forEach((el) => observer.observe(el))
