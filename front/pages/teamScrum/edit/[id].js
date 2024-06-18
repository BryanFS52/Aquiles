import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { updateTeamScrum, getTeamScrumById } from "../../../src/app/services/teamScrumService";
import styles from "../../../resources/styles/teamScrum.css"
import candado from "../../../resources/img/iconoContraseña.png"

const EditTeamScrum = ({id}) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const router = useRouter();
    const [teamData, setTeamData] = useState({});

    useEffect(() => {
        const fetchData = () => {
            getTeamScrumById(id)
            .then(data => {
                setTeamData(data);
                setValue('nameProject', data.nameProject); // Inicializar el valor del formulario
                setValue('team_scrum_id', data.team_scrum_id); // Inicializar el valor del formulario
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
        };

        fetchData();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        data.team_scrum_id = id; // Asegura que el ID esta incluido en los datos
        await updateTeamScrum(data);
        reset();
        router.push('../list');
    };

    return (
        <div className="containerCreate">
            <h1 className="titleCreate">Editar un proyecto</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="cajaInput">
                    <label htmlFor="nameProject" className="label1">Nombre del proyecto</label>
                    <input {...register('nameProject', { required: true })} id="nameProject" className="input" />
                </div>
                <div className="cajaInput">
                    <label htmlFor="team_scrum_id" className="label2">Número de proyecto</label>
                    <div className="inputIconEdit">
                        <input {...register('team_scrum_id')} id="team_scrum_id" className="input2" readOnly />
                        <img src={candado.src} alt="candado" className="iconEdit" />
                    </div>
                </div>
                <div className="contButtonCreate">
                    <button type="button" className="buttonCreate cancelButton" onClick={() => router.push('../list')} >
                        Cancelar
                    </button>
                    <button type="submit" className="buttonCreate registerButton">
                        Actualizar
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