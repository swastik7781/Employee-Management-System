
const API_URL = 'http://localhost:5000/api';

async function main() {
    try {
        console.log('Logging in as Admin...');

        // Node 18+ fetch is global
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@swastikindustries.com',
                password: 'Admin@123'
            })
        });

        const loginData = await loginRes.json();

        if (!loginData.success) {
            console.error('❌ Admin Login Failed:', loginData.message);
            process.exit(1);
        }

        const token = loginData.data.token;
        console.log('✅ Admin Login Successful.');

        console.log('Fetching Employees...');
        const empRes = await fetch(`${API_URL}/employees?limit=5`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const empData = await empRes.json();
        const employees = empData.data;

        if (!employees || employees.length === 0) {
            console.log('❌ No employees found.');
            process.exit(1);
        }

        console.log('\n--- VALID EMPLOYEE CREDENTIALS ---');
        console.log('Use any of the following to login:\n');

        employees.forEach(emp => {
            const email = emp.contactInfo?.email || emp.email || 'N/A';
            const name = `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`;

            console.log(`Name: ${name}`);
            console.log(`Email: ${email}`);
            console.log(`Password: Employee@123`);
            console.log('-----------------------------------');
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
