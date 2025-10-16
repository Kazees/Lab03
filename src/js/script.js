class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.id = Date.now();
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = notaFinal;
    }

    isAprovado() {
        return this.notaFinal >= 7;
    }

    toString() {
        return `Nome: ${this.nome}, Idade: ${this.idade}, Curso: ${this.curso}, Nota Final: ${this.notaFinal}`
    }
}

let students = [];
let isEditing = false;

// Ref para a DOM
const form = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
const reportOutput = document.getElementById("report-output");
const submitButton = document.getElementById("submit-button");
const studentId = document.getElementById("student-id");

// Renderizar alunos
const renderTable = () => {
    studentList.innerHTML = "";
    students.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.nome}</td>
            <td>${student.idade}</td>
            <td>${student.curso}</td>
            <td>${student.notaFinal}</td>
            <td> ${student.isAprovado() ? "Aprovado" : "Reprovado"}</td>
            <td>
                <button class="edit-btn" data-id="${student.id}">Editar</button>
                <button class="delete-btn" data-id="${student.id}">Excluir</button>
            </td>
        `;
        studentList.appendChild(row);
    });
};

// Envio do formulário (add ou edit)
const handleSubmit = (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const curso = document.getElementById("curso").value;
    const notaFinal = parseFloat(document.getElementById("notaFinal").value);
    const id = parseInt(studentId.value);

    if (isEditing) {
        const studentIdx = students.findIndex((student) => student.id === id);
       
        // Editar aluno
        if (studentIdx > -1) {
            const alunoAtualizado = new Aluno(nome, idade, curso, notaFinal);
            alunoAtualizado.id = id;
            students[studentIdx] = alunoAtualizado;
            isEditing = false;
            alert(`Aluno "${nome}" atualizado com sucesso!`);
        }
    }

    // Adicionar Aluno
    else {
        const aluno = new Aluno(nome, idade, curso, notaFinal);
        students.push(aluno);
        alert(`Aluno "${nome}" cadastrado com sucesso!`);
    }

    resetForm();
    renderTable();
};

const resetForm = () => {
    form.reset();
    isEditing = false;
    //document.getElementById("nome").value = "";
    studentId.value = "";
    submitButton.textContent = "Cadastrar";
};

// Form Edit Aluno
const editAluno = (id) => {
    const aluno = students.find((student) => student.id === id);
    if (!aluno) return;

    document.getElementById("student-id").value = aluno.id;
    document.getElementById("nome").value = aluno.nome;
    document.getElementById("idade").value = aluno.idade;
    document.getElementById("curso").value = aluno.curso;
    document.getElementById("notaFinal").value = aluno.notaFinal;

    submitButton.textContent = "Editar";
    isEditing = true;
};

// Função exlcuir
const deleteAluno = (id) => {
    const alunoIdx = students.findIndex((student) => student.id === id);
    if (alunoIdx > -1) {
        const studentName = students[alunoIdx].nome;
        students.splice(alunoIdx, 1);
        alert(`Aluno "${studentName}" excluído com sucesso.`);
        renderTable();
    }
};

form.addEventListener("submit", handleSubmit);

studentList.addEventListener("click", (event) => {
    const target = event.target;
    const id = parseInt(target.getAttribute('data-id'));
    
    if (target.classList.contains("edit-btn")) {
        editAluno(id);
    } 

    else if (target.classList.contains("delete-btn")) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            deleteAluno(id);
        }
    }
});

document.getElementById("btn-app").addEventListener("click", () => {
    const aprovados = students.filter((student) => student.isAprovado()).map((student) => student.nome);
    reportOutput.innerHTML = `<strong>Alunos Aprovados:</strong> ${aprovados.join(', ')}`;
});

document.getElementById("btn-media-notas").addEventListener("click", () => {
    if (students.length === 0) {
        reportOutput.innerHTML = '<strong>Média das Notas Finais:</strong> N/A (nenhum aluno cadastrado)';
        return;
    }

    const totalNotas = students.reduce((acc, student) => acc + student.notaFinal, 0);
    const mediaNotas = totalNotas / students.length;
    reportOutput.innerHTML = `<strong>Média das Notas Finais:</strong> ${mediaNotas.toFixed(2)}`;
});

document.getElementById("btn-media-idade").addEventListener("click", () => {
    if (students.length === 0) {
        reportOutput.innerHTML = '<strong>Média das Idades:</strong> N/A (nenhum aluno cadastrado)';
        return;
    }

    const totalIdades = students.reduce((acc, student) => acc + student.idade, 0);
    const mediaIdades = totalIdades / students.length;
    reportOutput.innerHTML = `<strong>Média das Idades:</strong> ${mediaIdades.toFixed(1)}`;
});

document.getElementById("btn-ordem-alfabetica").addEventListener("click", () => {
    const nomes = students.map((student) => student.nome).sort();
    reportOutput.innerHTML = `<strong>Nomes em Ordem Alfabética:</strong> ${nomes.join(', ')}`;
});

document.getElementById("btn-total-curso").addEventListener("click", () => {
    const cursos = students.reduce((acc, student) => {
        acc[student.curso] = (acc[student.curso] || 0) + 1;
        return acc;
    }, {});
    
    let reportString = '<strong>Total por Curso:</strong><br>';
    for (const curso in cursos) {
        reportString += `${curso}: ${cursos[curso]}<br>`;
    }
    reportOutput.innerHTML = Object.keys(cursos).length > 0 ? reportString : '<strong>Total por Curso:</strong> Nenhum';
});

renderTable();