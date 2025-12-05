import './Education.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Education() {
    const [qualifications, setQualifications] = useState([]);
    const [form, setForm] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        completion: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();




    useEffect(() => {
        const fetchQualifications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/signin');
                    return;
                }
                const response = await fetch('/api/qualifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch education/qualifications');
                const data = await response.json();
                setQualifications(data);
            } catch (err) {
                console.error('Error fetching education/qualification:', err);
            }


        };
        fetchQualifications();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editingId ? `/api/qualifications/${editingId}` : '/api/qualifications';
        const method = editingId ? 'PUT' : 'POST';




        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            if (!response.ok) throw new Error('Failed to save education');
            const updated = await response.json();

            if (editingId) {
                setQualifications(qualifications.map(q => q._id === editingId ? updated : q));
            } else {
                setQualifications([...qualifications, updated]);
            }

            setForm({
                title: '',
                firstname: '',
                lastname: '',
                email: '',
                completion: '',
                description: ''
            });
            setEditingId(null);
        } catch (err) {
            console.error('Error saving education/qualification:', err);
        }
    };

    const handleEdit = (qualification) => {
        setForm({
            title: qualification.title,
            firstname: qualification.firstname,
            lastname: qualification.lastname,
            email: qualification.email,
            completion: qualification.completion ? qualification.completion.split('T')[0] : '',
            description: qualification.description
        });
        setEditingId(qualification._id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/qualifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete education/qualification');
            setQualifications(qualifications.filter(q => q._id !== id));
        } catch (err) {
            console.error('Error deleting education/qualification:', err);
        }
    };

    const role = localStorage.getItem("role");

    return (
        <>
            <div>
                <h1>Past Education/Qualification</h1>
                {role === "admin" && (


                    <form onSubmit={handleSubmit}>
                        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="School / Program / Degree" required />
                        <input type="text" name="firstname" value={form.firstname} onChange={handleChange} placeholder="First Name" required />
                        <input type="text" name="lastname" value={form.lastname} onChange={handleChange} placeholder="Last Name" required />
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                        <br /><br />
                        <label>Completion Date: </label>
                        <input type="date" name="completion" value={form.completion} onChange={handleChange} required />
                        <br /><br />
                        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
                        <button type="submit">{editingId ? 'Update' : 'Add'} Qualification</button>
                    </form>
                )}

                {qualifications.length > 0 ? (
                    <table className="education-qualification-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Completion</th>
                                <th>Description</th>
                                {localStorage.getItem("role") === "admin" && <th>Actions</th>}

                            </tr>
                        </thead>
                        <tbody>
                            {qualifications.map((q) => (
                                <tr key={q._id}>
                                    <td>{q.title}</td>
                                    <td>{q.firstname}</td>
                                    <td>{q.lastname}</td>
                                    <td>{q.email}</td>
                                    <td>{q.completion ? new Date(q.completion).toISOString().split('T')[0] : '-'}</td>
                                    <td>{q.description}</td>
                                    {localStorage.getItem("role") === "admin" && (
                                        <td>
                                            <button onClick={() => handleEdit(q)}>Update</button>
                                            <button onClick={() => handleDelete(q._id)}>Delete</button>
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No Education Records Saved</p>
                )}
            </div>
        </>
    );
}