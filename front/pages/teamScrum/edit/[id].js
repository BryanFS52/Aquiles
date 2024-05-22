import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { updateTeamScrum, getTeamScrumById } from "../../../src/app/services/teamScrumService";
import styles from "../../../resources/styles/teamScrum.css"

const EditTeamScrum = ({id}) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const router = useRouter();
    const [team_scrum_id, setTeam_scrum_id] = useState('');

    useEffect(() => {
        const fetchData = () => {
            const data = getTeamScrumById(id);
            setValue('nameProject', data.nameProject);
            setTeam_scrum_id(data.team_scrum_id);
        };

        fetchData();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        data.team_scrum_id = id; // Asegura que el ID esta incluido en los datos
        await updateTeamScrum(data);
        reset();
        router.push('/list');
    };

    return (
        <div className="containerCreate">
            <h1 className="titleCreate">Editar un proyecto</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="cajaInput">
                    <label htmlFor="nameProject" className="label1">Nombre del proyecto</label>
                    <input {...register('nameProject', { required: true })} id="nameProject" className="input" value={nameProject} />
                </div>
                <div className="cajaInput">
                    <label htmlFor="team_scrum_id" className="label2">Asignar numero de proyecto proyecto</label>
                    <input {...register('team_scrum_id')} id="team_scrum_id" className="input" readOnly value={team_scrum_id} />
                </div>
                <div className="contButtonCreate">
                    <button type="button" className="buttonCreate cancelButton" onClick={() => router.push('/list')} >
                        Cancelar
                    </button>
                    <button type="submit" className="buttonCreate registerButton">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;
    return { props: { id } };
}


export default EditTeamScrum;