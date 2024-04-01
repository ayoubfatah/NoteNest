import { useState } from "react";

function useDate() {
  //   const [currentDateTime, setCurrentDateTime] = useState(new Date());

  function formatCurrentDateTime() {
    const dateTime = new Date();
    const year = dateTime.getFullYear();
    const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    const day = ("0" + dateTime.getDate()).slice(-2);
    const hours = ("0" + dateTime.getHours()).slice(-2);
    const minutes = ("0" + dateTime.getMinutes()).slice(-2);

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const currentDate = formatCurrentDateTime();
  return { currentDate };
}

export default useDate;
