import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { createTeamScrum } from "../../src/app/services/teamScrumService";
import styles from "../../styles/teamScrum.css"

const CreateTeamScrum = () => {
    const { register, handleSubmit, reset } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        await createTeamScrum(data);
        reset();
        router.push('/list');
    };

    return (
        <div className="container">
            <h1 className="title">Nuevo Proyecto</h1>
            <form className="formC" onSubmit={handleSubmit(onSubmit)}>
                <div className="inputWrapper">
                    <label htmlFor="nameProject" className="label">Nombre del proyecto</label>
                    <input 
                        {...register('nameProject', { required: true })}
                        id="nameProject"
                        className="input"
                    />
                </div>
                <div className="contButton">
                    <button 
                        type="button"
                        className="button cancelButton"
                        onClick={() => router.push('/teams-scrum')}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        className="button registerButton"
                    >
                        Registrar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTeamScrum;