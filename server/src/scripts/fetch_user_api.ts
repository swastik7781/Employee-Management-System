
const API_URL = 'http://localhost:5000/api';

const fetchUser = async () => {
    try {
        console.log('Logging in as Admin...');
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

        console.log('Fetching Employee...');
        const empRes = await fetch(`${API_URL}/employees?limit=5`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const empResponse = await empRes.json();
        const employees = empResponse.data;

        if (!employees || employees.length === 0) {
            console.error('❌ No employees found via API.');
            process.exit(1);
        }

        console.log('\n✅ FOUND VALID EMPLOYEES:');
        employees.forEach(emp => {
            const email = emp.contactInfo?.email || emp.userId?.email || 'N/A';
            console.log(`- ${emp.personalInfo.firstName} ${emp.personalInfo.lastName}: ${email}  (Password: Employee@123)`);
        });

        console.log('-----------------------------------');
        console.log('Try logging in with one of the above.');

        process.exit(0);

    } catch (error) {
        console.error('❌ Script Error:', error);
        process.exit(1);
    }
};

fetchUser();
