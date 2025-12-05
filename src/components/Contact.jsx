import './Contact.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: ''
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/signin');
                    return;
                }
                const response = await fetch('/api/contacts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch contacts');
                const data = await response.json();
                setContacts(data);
            } catch (err) {
                console.error('Error fetching contacts:', err);
            }
        };
        fetchContacts();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts';
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
            if (!response.ok) throw new Error('Failed to save contact');
            const updated = await response.json();

            if (editingId) {
                setContacts(contacts.map(c => c._id === editingId ? updated : c));
            } else {
                setContacts([...contacts, updated]);
            }

            setForm({ firstname: '', lastname: '', email: '' });
            setEditingId(null);
        } catch (err) {
            console.error('Error saving contact:', err);
        }
    };

    const handleEdit = (contact) => {
        setForm({
            firstname: contact.firstname,
            lastname: contact.lastname,
            email: contact.email
        });
        setEditingId(contact._id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete contact');
            setContacts(contacts.filter(c => c._id !== id));
        } catch (err) {
            console.error('Error deleting contact:', err);
        }
    };

    const role = localStorage.getItem("role");

    return (
        <>
            <div>
                <h1>Contact Information</h1>
                <p className="parabold">Rohan Tenn</p>
                <p className="parabold">rtenn4@my.centennialcollege.ca</p>
                <p className="parabold">647-524-4425</p>
                <p className="parabold">Toronto, Canada</p>
                <hr />

                <h2>Any Questions? - Add Contact Information</h2>
                {role === "admin" && (

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="firstname"
                            value={form.firstname}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                        />
                        <input
                            type="text"
                            name="lastname"
                            value={form.lastname}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <button type="submit">{editingId ? 'Update' : 'Add'} Contact</button>
                    </form>
                )}

                {contacts.length > 0 ? (
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                {localStorage.getItem("role") === "admin" && <th>Actions</th>}


                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.firstname}</td>
                                    <td>{c.lastname}</td>
                                    <td>{c.email}</td>
                                    {localStorage.getItem("role") === "admin" && (
                                        <td>
                                            <button onClick={() => handleEdit(c)}>Update</button>
                                            <button onClick={() => handleDelete(c._id)}>Delete</button>
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No Contacts Saved</p>
                )}
            </div>
        </>
    );
}