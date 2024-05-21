import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { createTeamScrum } from "../../src/app/services/teamScrumService";
import styles from "../teamScrum.css";

const CreateTeamScrum = () => {
    const { register, handleSubmit, reset } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        await createTeamScrum(data);
        reset();
        router.push('/teams-scrum');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Nuevo Proyecto</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputWrapper}>
                    <label htmlFor="nameProject" className={styles.label}>Nombre del proyecto</label>
                    <input 
                        {...register('nameProject', { required: true })}
                        id="nameProject"
                        className={styles.input}
                    />
                </div>
                <div className="flex justify-between">
                    <button 
                        type="button"
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={() => router.push('/teams-scrum')}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        className={`${styles.button} ${styles.registerButton}`}
                    >
                        Registrar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTeamScrum;