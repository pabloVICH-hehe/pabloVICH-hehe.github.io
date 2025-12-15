// Данные хранятся в localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [];

// Элементы DOM
const showAddStudentBtn = document.getElementById('showAddStudent');
const showAddTeacherBtn = document.getElementById('showAddTeacher');
const showStudentsBtn = document.getElementById('showStudents');
const showTeachersBtn = document.getElementById('showTeachers');
const showStatsBtn = document.getElementById('showStats');

const addStudentForm = document.getElementById('addStudentForm');
const addTeacherForm = document.getElementById('addTeacherForm');
const studentsList = document.getElementById('studentsList');
const teachersList = document.getElementById('teachersList');
const statsSection = document.getElementById('statsSection');

const studentForm = document.getElementById('studentForm');
const teacherForm = document.getElementById('teacherForm');

const studentsTableBody = document.getElementById('studentsTableBody');
const teachersTableBody = document.getElementById('teachersTableBody');

// Показать нужную секцию
function showSection(section) {
    // Скрыть все секции
    [addStudentForm, addTeacherForm, studentsList, teachersList, statsSection].forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Показать выбранную секцию
    section.classList.add('active');
}

// Обработчики кнопок
showAddStudentBtn.addEventListener('click', () => showSection(addStudentForm));
showAddTeacherBtn.addEventListener('click', () => showSection(addTeacherForm));
showStudentsBtn.addEventListener('click', () => {
    showSection(studentsList);
    displayStudents();
});
showTeachersBtn.addEventListener('click', () => {
    showSection(teachersList);
    displayTeachers();
});
showStatsBtn.addEventListener('click', () => {
    showSection(statsSection);
    updateStats();
});

// Добавление ученика
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const student = {
        id: Date.now(),
        name: document.getElementById('studentName').value,
        class: document.getElementById('studentClass').value,
        birthdate: document.getElementById('studentBirthdate').value,
        phone: document.getElementById('studentPhone').value,
        dateAdded: new Date().toLocaleDateString('ru-RU')
    };
    
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    
    studentForm.reset();
    alert('Ученик успешно добавлен!');
    displayStudents();
    showSection(studentsList);
});

// Добавление преподавателя
teacherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const teacher = {
        id: Date.now(),
        name: document.getElementById('teacherName').value,
        subject: document.getElementById('teacherSubject').value,
        experience: parseInt(document.getElementById('teacherExperience').value),
        email: document.getElementById('teacherEmail').value,
        dateAdded: new Date().toLocaleDateString('ru-RU')
    };
    
    teachers.push(teacher);
    localStorage.setItem('teachers', JSON.stringify(teachers));
    
    teacherForm.reset();
    alert('Преподаватель успешно добавлен!');
    displayTeachers();
    showSection(teachersList);
});

// Отображение учеников
function displayStudents() {
    studentsTableBody.innerHTML = '';
    
    if (students.length === 0) {
        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: rgb(206, 182, 182);">
                    Нет данных об учениках
                </td>
            </tr>
        `;
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${formatDate(student.birthdate)}</td>
            <td>${student.phone || 'Не указан'}</td>
            <td>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">
                    Удалить
                </button>
            </td>
        `;
        studentsTableBody.appendChild(row);
    });
}

// Отображение преподавателей
function displayTeachers() {
    teachersTableBody.innerHTML = '';
    
    if (teachers.length === 0) {
        teachersTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: rgb(206, 182, 182);">
                    Нет данных о преподавателях
                </td>
            </tr>
        `;
        return;
    }
    
    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.experience} лет</td>
            <td>${teacher.email}</td>
            <td>
                <button class="delete-btn" onclick="deleteTeacher(${teacher.id})">
                    Удалить
                </button>
            </td>
        `;
        teachersTableBody.appendChild(row);
    });
}

// Удаление ученика
window.deleteStudent = function(id) {
    if (confirm('Вы уверены, что хотите удалить этого ученика?')) {
        students = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
        updateStats();
    }
};

// Удаление преподавателя
window.deleteTeacher = function(id) {
    if (confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
        teachers = teachers.filter(teacher => teacher.id !== id);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        displayTeachers();
        updateStats();
    }
};

// Обновление статистики
function updateStats() {
    // Общее количество учеников
    document.getElementById('totalStudents').textContent = students.length;
    
    // Общее количество преподавателей
    document.getElementById('totalTeachers').textContent = teachers.length;
    
    // Средний стаж
    const avgExp = teachers.length > 0 
        ? (teachers.reduce((sum, teacher) => sum + teacher.experience, 0) / teachers.length).toFixed(1)
        : 0;
    document.getElementById('avgExperience').textContent = avgExp;
    
    // Количество уникальных классов
    const classes = [...new Set(students.map(student => student.class))];
    document.getElementById('totalClasses').textContent = classes.length;
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    displayStudents();
    displayTeachers();
    updateStats();
    showSection(studentsList);
});