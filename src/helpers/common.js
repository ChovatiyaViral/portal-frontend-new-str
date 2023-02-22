export const printDocument = (ID) => {
  let printContents = document.getElementById(ID).innerHTML;
  let originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
};

export const topFunction = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

export const scrollIntoView = (ID) => {
  document.getElementById(ID).scrollIntoView({ behavior: "smooth" });
};
