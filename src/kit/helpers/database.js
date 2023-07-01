export const dbState = { db: null };

export function insertEmployee({ firstName, lastName, rank, serviceLocation }) {
  insertRecord(
    {
      first_name: firstName,
      last_name: lastName,
      rank,
      service_location: serviceLocation,
    },
    "employees"
  );
}

export function selectEmployee() {
  return selectRecord("employees");
}

export function updateEmployee(conditions, data) {
  updateRecord(conditions, data, "employees");
}

export function deleteEmployee(conditions) {
  deleteRecord(conditions, "employees");
}

function insertRecord(data, tableName) {
  const db = dbState.db;

  let query = `INSERT INTO ${tableName} (`;
  let queryValues = ` VALUES (`;

  const dataEntries = Object.entries(data);
  for (const itemIndex in dataEntries) {
    query += dataEntries[itemIndex][0];

    const value = dataEntries[itemIndex][1];
    queryValues += typeof value === "string" ? `"${value}"` : value;

    if (itemIndex == dataEntries.length - 1) {
      query += ")";
      queryValues += ")";
      query += queryValues;
    } else {
      query += ",";
      queryValues += ",";
    }
  }

  db.transaction(function (tx) {
    tx.executeSql(query);
  });
}

function selectRecord(tableName) {
  const db = dbState.db;

  let queryCondition = `SELECT rowid, * FROM ${tableName}`;

  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        queryCondition,
        [],
        function (tx, result) {
          const resultAsArray = [];

          const length = result.rows.length;
          for (let i = 0; i < length; i++)
            resultAsArray.push(result.rows.item(i));

          resolve(resultAsArray);
        },
        null
      );
    });
  });
}

function updateRecord(conditions, data, tableName) {
  const db = dbState.db;

  let query = `UPDATE ${tableName} SET `;
  let queryCondition = ` WHERE `;

  const dataEntries = Object.entries(data);
  for (const itemIndex in dataEntries) {
    const value = dataEntries[itemIndex][1];
    query += `${dataEntries[itemIndex][0]} = ${
      typeof value === "string" ? `"${value}"` : value
    }`;

    if (itemIndex != dataEntries.length - 1) query += ", ";
  }

  const conditionEntries = Object.entries(conditions);
  for (const itemIndex in conditionEntries) {
    const value = conditionEntries[itemIndex][1];
    queryCondition += `${conditionEntries[itemIndex][0]} = ${
      typeof value === "string" ? `"${value}"` : value
    }`;

    if (itemIndex != conditionEntries.length - 1) queryCondition += ", ";
  }

  query += queryCondition;

  db.transaction(function (tx) {
    tx.executeSql(query);
  });
}

function deleteRecord(conditions, tableName) {
  const db = dbState.db;

  let query = `DELETE FROM ${tableName} WHERE `;

  const conditionEntries = Object.entries(conditions);
  for (const itemIndex in conditionEntries) {
    const value = conditionEntries[itemIndex][1];
    query += `${conditionEntries[itemIndex][0]} = ${
      typeof value === "string" ? `"${value}"` : value
    }`;

    if (itemIndex != conditionEntries.length - 1) query += ", ";
  }

  db.transaction(function (tx) {
    tx.executeSql(query);
  });
}