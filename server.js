const express = require(`express`);
const pgp = require(`pg-promise`)();
const db = pgp(`postgres://qonnxkqn:yAamuth4AZ0bhZEGuoBLeR6tfHO-wXYC@raja.db.elephantsql.com/qonnxkqn`);
const PORT = 3000;

const app = express();
app.use(express.json());

// Update the average_grade of all students in grade 12 by increasing it by 5%
app.put('/students/updateGrade12', async (req, res) => {
    await db.none('UPDATE students SET average_grade = average_grade * 1.05 WHERE grade_level = 12');
    res.send('Average grades updated for all students in grade 12.');
});

// Delete the student with the lowest attendance_rate
app.delete('/students/deleteLowestAttendance', async (req, res) => {
    await db.none('DELETE FROM students WHERE id = (SELECT id FROM students ORDER BY attendance_rate ASC LIMIT 1)');
    res.send('Deleted student with the lowest attendance rate.');
});

// Show all students participating in sports
app.get('/students/sportsParticipants', async (req, res) => {
    const sportsParticipants = await db.any('SELECT * FROM students WHERE sports_participation = true');
    res.json(sportsParticipants);
});

// Show the average attendance_rate of students in grade 10
app.get('/students/averageAttendanceGrade10', async (req, res) => {
    const avgAttendanceGrade10 = await db.one('SELECT AVG(attendance_rate) AS average_attendance_rate FROM students WHERE grade_level = 10');
    res.json(avgAttendanceGrade10);
});

// Add a column class_rank to the table
app.put('/students/addClassRankColumn', async (req, res) => {
    await db.none('ALTER TABLE students ADD COLUMN class_rank VARCHAR(50)');
    res.send('Column "class_rank" added to table "students"');
});

// Update the table so that all students with an average_grade above 90 have their class_rank set to "Top 10%"
app.put('/students/updateTopPerformersClassRank', async (req, res) => {
    await db.none('UPDATE students SET class_rank = \'Top 10%\' WHERE average_grade > 90');
    res.send('Class ranks updated for top performers');
});

// Show the names and grade levels of students with a class_rank of "Top 10%"
app.get('/students/topPerformers', async (req, res) => {
    const topPerformers = await db.any('SELECT name, grade_level FROM students WHERE class_rank = \'Top 10%\'');
    res.json(topPerformers);
});

app.listen(PORT, () => {
    console.log(`Server is running on port 3000.`);
});