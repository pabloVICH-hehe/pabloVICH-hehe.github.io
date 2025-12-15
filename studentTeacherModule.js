// studentTeacherModule.js
const STORAGE_KEY = 'musicSchoolData';
let schoolData = { students: [], teachers: [] };

function initData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) schoolData = JSON.parse(saved);
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schoolData));
}

// Ученики
function addStudent(name, age, instrument, level = 'начальный') {
    const student = {
        id: Date.now() + Math.random(),
        name, age: parseInt(age), instrument, level,
        joinDate: new Date().toISOString().split('T')[0]
    };
    schoolData.students.push(student);
    saveData();
    return student;
}

function removeStudent(id) {
    schoolData.students = schoolData.students.filter(s => s.id !== id);
    saveData();
}

function getAllStudents() {
    return [...schoolData.students];
}

// Преподаватели
function addTeacher(name, instrument, experience, rate = 0) {
    const teacher = {
        id: Date.now() + Math.random(),
        name, instrument,
        experience: parseInt(experience),
        rate: parseFloat(rate),
        hireDate: new Date().toISOString().split('T')[0]
    };
    schoolData.teachers.push(teacher);
    saveData();
    return teacher;
}

function removeTeacher(id) {
    schoolData.teachers = schoolData.teachers.filter(t => t.id !== id);
    saveData();
}

function getAllTeachers() {
    return [...schoolData.teachers];
}

// UI
function createModuleUI() {
    initData();
    
    const container = document.createElement('div');
    container.className = 'module-container';
    container.innerHTML = `
        <style>
            .module-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgb(121, 95, 84); padding: 20px; border-radius: 10px; z-index: 1000;
                max-width: 90vw; max-height: 90vh; overflow-y: auto; }
            .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
            .tab-btn { background: rgb(75, 58, 50); color: white; border: none; 
                padding: 10px 20px; border-radius: 5px; cursor: pointer; }
            .tab-btn.active { background: rgb(92, 71, 62); }
            .form-group { margin-bottom: 10px; }
            .form-group input, .form-group select { width: 100%; padding: 8px; 
                border: 1px solid rgb(75, 58, 50); border-radius: 5px; }
            .list-container { max-height: 300px; overflow-y: auto; margin-top: 20px; }
            .list-item { background: rgba(75, 58, 50, 0.3); padding: 10px; 
                margin-bottom: 10px; border-radius: 5px; }
        </style>
        
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <h2>🎵 Учет учеников и преподавателей</h2>
            <button class="close-btn" style="background:rgb(75,58,50); color:white; border:none; padding:5px 15px; border-radius:5px;">Закрыть</button>
        </div>
        
        <div class="tabs">
            <button class="tab-btn active" data-tab="students">Ученики</button>
            <button class="tab-btn" data-tab="teachers">Преподаватели</button>
            <button class="tab-btn" data-tab="stats">Статистика</button>
        </div>
        
        <div id="students-tab">
            <div style="background:rgba(75,58,50,0.3); padding:15px; border-radius:5px; margin-bottom:20px;">
                <h3>Добавить ученика</h3>
                <div class="form-group"><input type="text" id="student-name" placeholder="ФИО"></div>
                <div class="form-group"><input type="number" id="student-age" placeholder="Возраст"></div>
                <div class="form-group">
                    <select id="student-instrument">
                        <option value="фортепиано">Фортепиано</option>
                        <option value="гитара">Гитара</option>
                        <option value="скрипка">Скрипка</option>
                    </select>
                </div>
                <button style="background:rgb(75,58,50); color:white; border:none; padding:10px 20px; border-radius:5px;" 
                        id="add-student-btn">Добавить</button>
            </div>
            <div class="list-container" id="students-list"></div>
        </div>
        
        <div id="teachers-tab" style="display:none;">
            <div style="background:rgba(75,58,50,0.3); padding:15px; border-radius:5px; margin-bottom:20px;">
                <h3>Добавить преподавателя</h3>
                <div class="form-group"><input type="text" id="teacher-name" placeholder="ФИО"></div>
                <div class="form-group">
                    <select id="teacher-instrument">
                        <option value="фортепиано">Фортепиано</option>
                        <option value="гитара">Гитара</option>
                        <option value="скрипка">Скрипка</option>
                    </select>
                </div>
                <div class="form-group"><input type="number" id="teacher-experience" placeholder="Стаж (лет)"></div>
                <button style="background:rgb(75,58,50); color:white; border:none; padding:10px 20px; border-radius:5px;" 
                        id="add-teacher-btn">Добавить</button>
            </div>
            <div class="list-container" id="teachers-list"></div>
        </div>
        
        <div id="stats-tab" style="display:none;">
            <div style="padding:10px; background:rgba(75,58,50,0.3); border-radius:5px;">
                <h3>📊 Статистика</h3>
                <p>Учеников: <span id="total-students">0</span></p>
                <p>Преподавателей: <span id="total-teachers">0</span></p>
                <p>Соотношение: <span id="ratio">0</span></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Обработчики
    container.querySelector('.close-btn').addEventListener('click', () => document.body.removeChild(container));
    
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            container.querySelectorAll('[id$="-tab"]').forEach(c => c.style.display = 'none');
            
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).style.display = 'block';
            if (btn.dataset.tab === 'stats') updateStats();
        });
    });
    
    container.querySelector('#add-student-btn').addEventListener('click', () => {
        const name = container.querySelector('#student-name').value.trim();
        const age = container.querySelector('#student-age').value;
        const instrument = container.querySelector('#student-instrument').value;
        
        if (name && age) {
            addStudent(name, age, instrument);
            renderStudents();
            container.querySelector('#student-name').value = '';
            container.querySelector('#student-age').value = '';
        }
    });
    
    container.querySelector('#add-teacher-btn').addEventListener('click', () => {
        const name = container.querySelector('#teacher-name').value.trim();
        const instrument = container.querySelector('#teacher-instrument').value;
        const experience = container.querySelector('#teacher-experience').value;
        
        if (name && experience) {
            addTeacher(name, instrument, experience);
            renderTeachers();
            container.querySelector('#teacher-name').value = '';
            container.querySelector('#teacher-experience').value = '';
        }
    });
    
    function renderStudents() {
        const list = container.querySelector('#students-list');
        const students = getAllStudents();
        
        list.innerHTML = students.length ? students.map(s => `
            <div class="list-item">
                <strong>${s.name}</strong> (${s.age} лет)<br>
                ${s.instrument}, ${s.level}<br>
                <button onclick="removeStudent(${s.id}); renderStudents(); updateStats()" 
                        style="background:rgb(150,50,50); color:white; border:none; padding:5px 10px; border-radius:3px; float:right;">
                        Удалить</button>
            </div>
        `).join('') : '<p>Нет учеников</p>';
    }
    
    function renderTeachers() {
        const list = container.querySelector('#teachers-list');
        const teachers = getAllTeachers();
        
        list.innerHTML = teachers.length ? teachers.map(t => `
            <div class="list-item">
                <strong>${t.name}</strong><br>
                ${t.instrument}, стаж ${t.experience} лет<br>
                <button onclick="removeTeacher(${t.id}); renderTeachers(); updateStats()"
                        style="background:rgb(150,50,50); color:white; border:none; padding:5px 10px; border-radius:3px; float:right;">
                        Удалить</button>
            </div>
        `).join('') : '<p>Нет преподавателей</p>';
    }
    
    function updateStats() {
        const students = getAllStudents();
        const teachers = getAllTeachers();
        const ratio = teachers.length ? (students.length / teachers.length).toFixed(1) : '∞';
        
        container.querySelector('#total-students').textContent = students.length;
        container.querySelector('#total-teachers').textContent = teachers.length;
        container.querySelector('#ratio').textContent = ratio;
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.contains(container)) {
            document.body.removeChild(container);
        }
    });
    
    renderStudents();
    renderTeachers();
    updateStats();
}

window.studentTeacherModule = createModuleUI;
