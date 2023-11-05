window.addEventListener("DOMContentLoaded", function(){
    function updateGlyphCount() {
        const characterViewerContainer = document.querySelector('.character-viewer__block__characters');
        const characterElements = characterViewerContainer.querySelectorAll('div[data-size="1"]');
        const characterCount = characterElements.length;
      
        const glyphCountDiv = document.getElementById('glyphCount');
        glyphCountDiv.innerHTML = `${characterCount}`;
      }
      
      // Call the function on the client side
      updateGlyphCount();


// Select elements with the class name "type-tester" after the component has mounted
const typeTesters = document.querySelectorAll(".type-tester");

// Loop through the selected elements and extract CSS properties
Array.from(typeTesters).forEach((typeTester, index) => {
  const fontWeightElement = typeTester.querySelector(".type-tester__text__font-style");
  const fontSizeElement = typeTester.querySelector(".type-tester__text__container");
  const fontStyleElement = typeTester.querySelector(".type-tester__text__font-style");

  const fontWeight = fontWeightElement
    ? window.getComputedStyle(fontWeightElement).getPropertyValue("font-weight")
    : "N/A";

  const fontSize = fontSizeElement
    ? window.getComputedStyle(fontSizeElement).getPropertyValue("font-size")
    : "N/A";

  const fontStyle = fontStyleElement
    ? window.getComputedStyle(fontStyleElement).getPropertyValue("font-family")
    : "N/A";

  // Use the extracted CSS properties as needed
  console.log(`Element ${index + 1}:`);
  console.log(`Font Weight: ${fontWeight}`);
  console.log(`Font Size: ${fontSize}`);
  console.log(`Font Style: ${fontStyle}`);
});
})