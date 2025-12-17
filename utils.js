import fs from "fs/promises";

const url = `https://spiestestserver.onrender.com`;

export async function getPeopleList() {
  try {
    const res = await fetch(url + "/people");
    const data = await res.text();
    fs.writeFile("PEOPLE.json", data, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file", err);
      } else {
        console.log("Data PEOPLE.json written to file");
      }
    });
  } catch (error) {
    console.log("Error is: ", error);
  }
}

export async function getRecordsTranscriptions() {
  try {
    const res = await fetch(url + "/transcriptions");
    const data = await res.text();
    fs.writeFile("TRANSCRIPTIONS.json", data, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file", err);
      } else {
        console.log("Data TRANSCRIPTIONS.json written to file");
      }
    });
  } catch (error) {
    console.log("Error is: ", error);
  }
}

export async function searchPeoplebyName(name) {
  let objs;
  let find = false;
  fs.readFile("PEOPLE.json", "utf8", function (err, data) {
    if (err) throw err;
    objs = JSON.parse(data);
    objs.forEach((obj) => {
      if (obj.name === name) {
        console.log(obj);
      }
    });
  });
  if (!find) {
    console.log("person was not found");
  }
}

export async function searchPeoplebyAge(age) {
  age = Number(age);
  let objs;
  let find = false;
  fs.readFile("PEOPLE.json", "utf8", function (err, data) {
    if (err) throw err;
    objs = JSON.parse(data);
    objs.forEach((obj) => {
      if (obj.age === age) {
        console.log(obj);
      }
    });
  });
  if (!find) {
    console.log("person was not found");
  }
}

export async function findDangerousPeople() {
  const dangerousAges = await dangerousAge();
  const dangerousCalls = await countDangerous(dangerousAges);
  const dangerAvg = await dangerousAverage(dangerousCalls);
  const topAges = await top3ages(dangerAvg);
  const findHuman = await findPeople(topAges);
  const sendPeopleUrl = await sendURl(findHuman);
  //   console.log(sendPeopleUrl);
}

async function dangerousAge() {
  let dangerLevel = {};
  const data = await fs.readFile("TRANSCRIPTIONS.json", "utf8");
  let objs = JSON.parse(data);
  objs.forEach((obj) => {
    dangerLevel[obj.age] = [];
  });
  return dangerLevel;
}

async function countDangerous(fileWork) {
  const dangerousWord = ["death", "knife", "bomb", "attack"];
  const data = await fs.readFile("TRANSCRIPTIONS.json", "utf8");
  let objs = JSON.parse(data);
  objs.forEach((obj) => {
    let count = 0;
    obj.content.split(" ").forEach((word) => {
      if (dangerousWord.includes(word.toLowerCase())) {
        count++;
      }
    });
    if (count !== 0) {
      fileWork[String(obj.age)].push(count);
    }
  });
  return fileWork;
}

function avgCalc(array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i];
  }
  let avg = total / array.length;
  return avg;
}

async function top3ages(fileWork) {
  const scores = fileWork;
  const sorted = Object.entries(scores)
    .sort((a, b) => a[1] - b[1])
    .reverse();
  return sorted.slice(0, 3);
}

async function dangerousAverage(fileWork) {
  let dngerAvg = {};
  let result = Object.keys(fileWork).map((key) => [key, fileWork[key]]);
  result.forEach((arr) => {
    if (arr[1].length > 0) {
      let res = avgCalc(arr[1]);
      dngerAvg[arr[0]] = res;
    }
  });
  return dngerAvg;
}

async function findPeople(top3) {
  const finded = [];
  const ages = [top3[0][0], top3[1][0], top3[2][0]];
  const data = await fs.readFile("PEOPLE.json", "utf8");
  let objs = JSON.parse(data);
  objs.forEach((obj) => {
    if (ages.includes(String(obj.age))) {
      finded.push(obj);
    }
  });
  return finded;
}

async function sendURl(peopleList) {
  const postMethod = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ peopleDanger: peopleList }),
  };
  try {
    const res = await fetch(url + "/report", postMethod);
    const data = await res.text();
    console.log(data);
  } catch (error) {
    console.log("Error is: ", error);
  }
}


