import './Projects.css';
import cafe from '../assets/cafe.png';
import gameoflife from '../assets/gameoflife.png';
import groceryapp from '../assets/groceryapp.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
    const [projects, setProjects] = useState([]);


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
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/signin');
                    return;
                }
                const response = await fetch('/api/projects', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed Get Projects');
                const data = await response.json();
                setProjects(data); // backend returns array
            } catch (err) {
                console.error('Error fetching projects:', err);
            }
        };
        fetchProjects();
    }, [navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
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
            if (!response.ok) throw new Error('Failed to save project');
            const updated = await response.json();

            if (editingId) {
                setProjects(projects.map(p => p._id === editingId ? updated : p));
            } else {
                setProjects([...projects, updated]);
            }

            setForm({ title: '', description: '' });
            setEditingId(null);
        } catch (err) {
            console.error('Error saving project:', err);
        }
    };


    const handleEdit = (project) => {
        setForm({ title: project.title, description: project.description });
        setEditingId(project._id);
    };


    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });



            if (!response.ok) throw new Error('Failed to delete project');
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    };

    const role = localStorage.getItem("role");


    return (
        <>
            <div>
                <h1>Your Projects</h1>
                {role === "admin" && (


                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Project Title"
                            required
                        />
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
                        <br /> <br />
                        <label>Completion Date:  </label>
                        <input
                            type="date"
                            name="completion"
                            value={form.completion}
                            onChange={handleChange}
                            required
                        />
                        <br /><br />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                            required
                        />
                        <button type="submit">{editingId ? 'Update' : 'Add'} Project</button>
                    </form>
                )}


                {projects.length > 0 ? (
                    <>
                        <table className="projects-table">
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
                                {projects.map((p) => (
                                    <tr key={p._id}>
                                        <td>{p.title}</td>
                                        <td>{p.firstname}</td>
                                        <td>{p.lastname}</td>
                                        <td>{p.email}</td>

                                        {/*Fix date timezone issue*/}
                                        <td>{p.completion ? new Date(p.completion).toISOString().split('T')[0] : '-'}</td>
                                        <td>{p.description}</td>
                                        {localStorage.getItem("role") === "admin" && (
                                            <td>
                                                <button onClick={() => handleEdit(p)}>Update</button>
                                                <button onClick={() => handleDelete(p._id)}>Delete</button>
                                            </td>
                                        )}

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </>) : (

                    <>
                        <p>No Projects Saved On this Account</p>
                    </>
                )}





                <div className="projects">
                    <div>
                        <b>In Development:</b> Grocery app for customers to pickup at the closest store.
                        <b> Role:</b> App Designer.
                        <br />
                        <img src={groceryapp} alt="app" />
                    </div>
                    <div>
                        <b>Completed:</b> A game called Conway's Game of Life created in C#.
                        <b> Role:</b> Main Developer.
                        <br />
                        <img src={gameoflife} alt="gameoflife image" />
                    </div>
                    <div>
                        <b>Completed:</b> Created a website for a restaurant called Cloud Cafe.
                        <b> Role:</b> Main/Only Developer.
                        <br />
                        <img src={cafe} alt="cafe" />
                    </div>
                </div>
            </div>
        </>
    );
}