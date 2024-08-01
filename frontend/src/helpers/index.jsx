export const formatHostname = (hostname) => {
  /* formatting colors via html correctly like this:
    ^0 is White (#F0F0F0)
    ^1 is Red (#F44336)
    ^2 is Green (#4CAF50)
    ^3 is Yellow (#FFEB3B)
    ^4 is Blue (#42A5F5)
    ^5 is Light Blue (#03A9F4)
    ^6 is Purple (#9C27B0)
    ^7 is White (#F0F0F0)
    ^8 is Orange (#FF5722)
    ^9 is Grey (#9E9E9E)
    */
  const colors = [
    "#F0F0F0",
    "#F44336",
    "#4CAF50",
    "#FFEB3B",
    "#42A5F5",
    "#03A9F4",
    "#9C27B0",
    "#F0F0F0",
    "#FF5722",
    "#9E9E9E",
  ];

  let formattedHostname = hostname;
  for (let i = 0; i < colors.length; i++) {
    formattedHostname = formattedHostname.replace(
      new RegExp("\\^" + i, "g"),
      `<span style="color:${colors[i]}"></span>`
    );
  }

  formattedHostname = formattedHostname.replace(/\^/g, "</span>");

  return formattedHostname;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const calculatePercentage = (clients, maxClients) => {
  return (clients / maxClients) * 100;
};

export const getColorForPercentage = (percentage) => {
  return percentage < 50 ? "success" : percentage < 90 ? "warning" : "danger";
};
