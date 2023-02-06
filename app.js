const express = require('express');
const cors = require('cors');
const { readFile, writeFile } = require('fs').promises;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const handlingCatchError = (e, res) => {
  if (e.code === 'ENOENT') {
    res.json(
      JSON.stringify({
        status: 'failed',
        message: "File doesn't exists",
      }),
    );
  } else {
    res.json(
      JSON.stringify({
        status: 'failed',
        message: `There is an error ${e.code}`,
      }),
    );
  }
};

const sendingDataToTheClient = async (req, res) => {
  try {
    const file = await readFile('data/data.json', 'utf-8');
    res.json(file);
  } catch (e) {
    handlingCatchError(e, res);
  }
};

const addingDataForTheClient = async (req, res) => {
  try {
    let dataBase = await readFile('data/data.json', 'utf8');
    let newId;
    if (dataBase.length === 0 || dataBase === []) {
      dataBase = [];
      newId = 0;
    } else {
      dataBase = JSON.parse(dataBase);

      newId = dataBase.at(-1).id + 1;
    }

    const newTaskObject = {
      taskName: req.body.taskName,
      id: newId,
      isFinished: false,
      dateFinishedTask: null,
    };
    dataBase.push(newTaskObject);
    await writeFile('data/data.json', JSON.stringify(dataBase), {
      encoding: 'utf-8',
    });
    res.json(
      JSON.stringify({
        status: 'success',
        message: "Everything it's ok",
      }),
    );
  } catch (e) {
    handlingCatchError(e, res);
  }
};

const toggleCheckingTask = async (req, res) => {
  const dataBase = JSON.parse(await readFile('data/data.json', 'utf8'));
  const { id, isFinished, dateFinishedTask } = req.body;
  const indexElementToChange = dataBase.findIndex((e) => e.id === id);
  dataBase[indexElementToChange].isFinished = isFinished;
  dataBase[indexElementToChange].dateFinishedTask = dateFinishedTask;
  try {
    await writeFile('data/data.json', JSON.stringify(dataBase), {
      encoding: 'utf-8',
    });
    res.json(
      JSON.stringify({
        status: 'success',
        message: "Everything it's ok",
      }),
    );
  } catch (e) {
    handlingCatchError(e, res);
  }
};

const editNameTask = async (req, res) => {
  try {
    const dataBase = JSON.parse(await readFile('data/data.json', 'utf8'));
    const { taskName, id } = req.body;
    const indexForEditingTask = dataBase.findIndex((e) => e.id === id);
    dataBase[indexForEditingTask].taskName = taskName;
    await writeFile('data/data.json', JSON.stringify(dataBase), {
      encoding: 'utf-8',
    });
    res.json(
      JSON.stringify({
        status: 'success',
        message: "Everything it's ok",
      }),
    );
  } catch (e) {
    handlingCatchError(e, res);
  }
};

const uncheckTasksForTheClient = async (req, res) => {
  const { isFinished, dateFinishedTask } = req.body;
  try {
    let dataBase = await readFile('data/data.json', 'utf8');
    if (dataBase.length === 0 || dataBase === []) {
      return;
    }
    dataBase = JSON.parse(dataBase);
    let newDataBase;
    if (isFinished) {
      newDataBase = dataBase.map((el) => {
        const newEl = {};
        newEl.taskName = el.taskName;
        newEl.id = el.id;
        newEl.isFinished = isFinished;
        newEl.dateFinishedTask = dateFinishedTask;
        return newEl;
      });
    } else {
      newDataBase = dataBase.map((el) => {
        const newEl = {};
        newEl.taskName = el.taskName;
        newEl.id = el.id;
        newEl.isFinished = isFinished;
        newEl.dateFinishedTask = el.dateFinishedTask;
        return newEl;
      });
    }

    await writeFile('data/data.json', JSON.stringify(newDataBase), {
      encoding: 'utf-8',
    });
    res.json(
      JSON.stringify({
        status: 'success',
        message: "Everything it's ok",
      }),
    );
  } catch (e) {
    handlingCatchError(e, res);
  }
};

const deleteTaskForTheClient = async (req, res) => {
  let dataBase = JSON.parse(await readFile('data/data.json', 'utf8'));
  const { idDeletingTask } = req.body;
  dataBase = dataBase.filter((e) => e.id !== idDeletingTask);
  try {
    let result;
    if (dataBase.length === 0) {
      result = '';
    } else {
      result = JSON.stringify(dataBase);
    }

    await writeFile('data/data.json', result, {
      encoding: 'utf-8',
    });
    res.json(
      JSON.stringify({
        status: 'success',
        message: "Everything it's ok",
      }),
    );
  } catch (e) {
    handlingCatchError(e, res);
  }
};

const deleteCheckedTasksForTheClient = async (req, res) => {
  try {
    let dataBase = await readFile('data/data.json', 'utf8');
    if (dataBase.length === 0 || dataBase === []) {
      return;
    }
    dataBase = JSON.parse(dataBase);
    const newDataBase = dataBase.filter((e) => e.isFinished === false);

    await writeFile('data/data.json', JSON.stringify(newDataBase), {
      encoding: 'utf-8',
    });
    res.json(
      JSON.stringify({
        status: 'success',
        message: "Everything it's ok",
      }),
    );
  } catch (e) {
    handlingCatchError(e, res);
  }

  //
  //
  // const dataBase = await readFile('data/data.json', 'utf8');
  // const { idDeletingTask } = req.body;
  // dataBase = dataBase.filter((e) => e.id !== idDeletingTask);
  // try {
  //   let result;
  //   if (dataBase.length === 0) {
  //     result = '';
  //   } else {
  //     result = JSON.stringify(dataBase);
  //   }
  //
  //   await writeFile('data/data.json', result, {
  //     encoding: 'utf-8',
  //   });
  //   res.json(
  //     JSON.stringify({
  //       status: 'success',
  //       message: "Everything it's ok",
  //     }),
  //   );
  // } catch (e) {
  //   handlingCatchError(e, res);
  // }
};

app.get('/loadingData', sendingDataToTheClient);
app.post('/', addingDataForTheClient);
app.patch('/', toggleCheckingTask);
app.patch('/editName', editNameTask);
app.patch('/checkUncheck', uncheckTasksForTheClient);
app.delete('/', deleteTaskForTheClient);
app.delete('/deleteCheckedTasks', deleteCheckedTasksForTheClient);

const port = 3000;
app.listen(port, 'localhost', () => {
  console.log(`Server launch on port ${port}`);
});
