let courses = [];
document.getElementById('semesterCalc').addEventListener('click', function() {
    document.getElementById('creditsGPAInput').style.display = 'none';
});
document.getElementById('overallCalc').addEventListener('click', function() {
    document.getElementById('creditsGPAInput').style.display = 'block';
});
document.getElementById('addCoursesBtn').addEventListener('click', function() {
    const numCourses = parseInt(document.getElementById('numCourses').value);
    if (numCourses < 1) {
        alert("En az 1 ders eklemelisiniz.");
        return;
    }
    const courseTableBody = document.querySelector('#courseTable tbody');
    courseTableBody.innerHTML = '';
    for (let i = 0; i < numCourses; i++) {
        const courseRow = document.createElement('tr');
        const courseNameCell = document.createElement('td');
        const courseNameInput = document.createElement('input');
        courseNameInput.type = 'text';
        courseNameInput.className = 'form-control form-control-sm';
        courseNameInput.placeholder = 'Ders Adı';
        courseNameCell.appendChild(courseNameInput);
        const creditCell = document.createElement('td');
        const creditInput = document.createElement('input');
        creditInput.type = 'number';
        creditInput.className = 'form-control form-control-sm';
        creditInput.placeholder = 'Kredi';
        creditInput.step = '0.5';
        creditCell.appendChild(creditInput);
        const gradeCell = document.createElement('td');
        const gradeSelect = document.createElement('select');
        gradeSelect.className = 'form-control form-control-sm';
        if (document.getElementById('useSecondSystem').checked) {
            const gradeOptions = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D", "F"];
            for (const optionValue of gradeOptions) {
                const option = document.createElement('option');
                option.value = optionValue;
                option.text = optionValue;
                gradeSelect.appendChild(option);
            }
        } else if (document.getElementById('useThirdSystem').checked) {
            const gradeOptions = ["AA", "AB", "BA", "BB", "BC", "CB", "CC", "CD", "DC", "DD", "FF"];
            for (const optionValue of gradeOptions) {
                const option = document.createElement('option');
                option.value = optionValue;
                option.text = optionValue;
                gradeSelect.appendChild(option);
            }
        } else if (document.getElementById('useFourthSystem').checked) {
            const gradeOptions = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];
            for (const optionValue of gradeOptions) {
                const option = document.createElement('option');
                option.value = optionValue;
                option.text = optionValue;
                gradeSelect.appendChild(option);
            }
        } else {
            const gradeOptions = ["AA", "BA", "BB", "CB", "CC", "DC", "DD", "FF"];
            for (const optionValue of gradeOptions) {
                const option = document.createElement('option');
                option.value = optionValue;
                option.text = optionValue;
                gradeSelect.appendChild(option);
            }
        }
        gradeCell.appendChild(gradeSelect);
        courseRow.appendChild(courseNameCell);
        courseRow.appendChild(creditCell);
        courseRow.appendChild(gradeCell);
        courseTableBody.appendChild(courseRow);
    }
    const actionButtons = document.getElementById('actionButtons');
    actionButtons.innerHTML = `

															<button type="button" id="calculateBtn" class="btn btn-primary mt-2 rounded-3">Hesapla</button>
															<button type="button" id="resetBtn" class="btn btn-info mt-2 rounded-3">Sıfırla</button>
    `;

    document.getElementById('calculateBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;

    document.getElementById('courseTable').style.display = 'table';
    document.getElementById('actionButtons').style.display = 'block';

    if (document.getElementById('overallCalc').checked) {
        document.getElementById('creditsGPAInput').style.display = 'block';
    } else {
        document.getElementById('creditsGPAInput').style.display = 'none';
    }
});
document.getElementById('actionButtons').addEventListener('click', function(event) {
    if (event.target.id === 'calculateBtn') {
        calculateGrades();
    } else if (event.target.id === 'resetBtn') {
        resetForm();
    }
});

function resetForm() {
    courses = [];
    const courseTableBody = document.querySelector('#courseTable tbody');
    courseTableBody.innerHTML = '';
    document.getElementById('numCourses').value = '';
    document.getElementById('credits').value = '';
    document.getElementById('currentGPA').value = '';
    document.getElementById('resultTable').innerHTML = '';

    document.getElementById('calculateBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;

    document.getElementById('courseTable').style.display = 'none';
    document.getElementById('actionButtons').style.display = 'none';
}

function calculateGrades() {
    courses = [];
    const courseRows = document.querySelectorAll('#courseTable tbody tr');
    courseRows.forEach(row => {
        const courseName = row.querySelector('td:nth-child(1) input').value;
        const credit = parseFloat(row.querySelector('td:nth-child(2) input').value);
        const grade = row.querySelector('td:nth-child(3) select').value;
        courses.push({
            name: courseName,
            credit: credit,
            grade: grade
        });
    });
    let totalCredits = 0;
    let totalPoints = 0;
    const useSecondSystem = document.getElementById('useSecondSystem').checked;
    const useThirdSystem = document.getElementById('useThirdSystem').checked;
    const useFourthSystem = document.getElementById('useFourthSystem').checked;
    courses.forEach(course => {
        totalCredits += course.credit;
        totalPoints += calculateGradePoints(course.grade, useThirdSystem, useSecondSystem, useFourthSystem) * course.credit;
    });
    let gpa = totalPoints / totalCredits;
    const overallCalc = document.getElementById('overallCalc');
    if (overallCalc.checked) {
        const credits = parseFloat(document.getElementById('credits').value);
        const currentGPA = parseFloat(document.getElementById('currentGPA').value);
        totalCredits += credits;
        totalPoints += currentGPA * credits;
        gpa = totalPoints / totalCredits;
    }
    const resultTable = document.getElementById('resultTable');
    let resultHtml = `

															<h3>Sonuçlar</h3>
  `;
    if (overallCalc.checked) {
        const currentCredits = parseFloat(document.getElementById('credits').value);
        const currentGPA = parseFloat(document.getElementById('currentGPA').value);
        resultHtml += `

															<p>Mevcut Kredi Sayısı: ${currentCredits}</p>
															<p>Mevcut Ortalama: ${currentGPA.toFixed(2)}</p>
    `;
    }
    resultHtml += `

															<p>Toplam Kredi Sayısı: ${totalCredits.toFixed(2)}</p>
															<p>Ağırlıklı Krediler Toplamı: ${totalPoints.toFixed(2)}</p>
															<p>
																<b>Genel Ağırlıklı Not Ortalaması: ${gpa.toFixed(2)}</b>
															</p>
															<div class="table-responsive border-0 rounded mb-3">
																<table class="table align-middle p-4 mb-0 table-hover table-shrink">
																	<thead>
																		<tr>
																			<th scope="col" class="border-0 small">
																				<b>Ders Adı</b>
																			</th>
																			<th scope="col" class="border-0 small">
																				<b>Kredi</b>
																			</th>
																			<th scope="col" class="border-0 small">
																				<b>Harf Notu</b>
																			</th>
																		</tr>
																	</thead>
																	<tbody class="border-top-0">
                ${courses.map(course => `

																		<tr>
																			<td>${course.name}</td>
																			<td>${course.credit}</td>
																			<td>${course.grade}</td>
																		</tr>`).join('')}

																	</tbody>
																</table>
															</div>
`;
    resultTable.innerHTML = resultHtml;
}

function calculateGradePoints(grade, useThirdSystem, useSecondSystem, useFourthSystem) {
    if (useThirdSystem) {
        switch (grade) {
            case 'AA':
                return 4.00;
            case 'AB':
                return 3.70;
            case 'BA':
                return 3.30;
            case 'BB':
                return 3.00;
            case 'BC':
                return 2.70;
            case 'CB':
                return 2.30;
            case 'CC':
                return 2.00;
            case 'CD':
                return 1.70;
            case 'DC':
                return 1.30;
            case 'DD':
                return 1.00;
            case 'FF':
                return 0.00;
            default:
                return 0.00;
        }
    } else if (useFourthSystem) {
        switch (grade) {
            case 'A':
                return 4.00;
            case 'A-':
                return 3.70;
            case 'B+':
                return 3.30;
            case 'B':
                return 3.00;
            case 'B-':
                return 2.70;
            case 'C+':
                return 2.30;
            case 'C':
                return 2.00;
            case 'C-':
                return 1.70;
            case 'D+':
                return 1.30;
            case 'D':
                return 1.00;
            case 'F':
                return 0.00;
            default:
                return 0.00;
        }
    } else if (useSecondSystem) {
        switch (grade) {
            case 'A1':
                return 4.00;
            case 'A2':
                return 3.75;
            case 'A3':
                return 3.50;
            case 'B1':
                return 3.25;
            case 'B2':
                return 3.00;
            case 'B3':
                return 2.75;
            case 'C1':
                return 2.50;
            case 'C2':
                return 2.25;
            case 'C3':
                return 2.00;
            case 'D':
                return 1.75;
            case 'F':
                return 0.00;
            default:
                return 0.00;
        }
    } else {
        switch (grade) {
            case 'AA':
                return 4.00;
            case 'BA':
                return 3.50;
            case 'BB':
                return 3.00;
            case 'CB':
                return 2.50;
            case 'CC':
                return 2.00;
            case 'DC':
                return 1.50;
            case 'DD':
                return 1.00;
            case 'FF':
                return 0.00;
            default:
                return 0.00;
        }
    }
}
