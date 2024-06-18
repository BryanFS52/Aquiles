import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { createTeamScrum } from "../../src/app/services/teamScrumService";
import styles from "../../resources/styles/teamScrum.css"

const CreateTeamScrum = ({ closeModal }) => {
    const { register, handleSubmit, reset } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        await createTeamScrum(data);
        reset();
        closeModal();
        router.reload();
    };

    return (
        <div className="containerCreate">
            <h1 className="titleCreate">Nuevo Proyecto</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="cajaInput">
                    <label htmlFor="nameProject" className="label1">Nombre del proyecto</label>
                    <input {...register('nameProject', { required: true })} id="nameProject" className="input" />
                </div>
                <div className="contButtonCreate">
                    <button type="button" className="buttonCreate cancelButton" onClick={closeModal} >
                        Cancelar
                    </button>
                    <button type="submit" className="buttonCreate registerButton">
                        Registrar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTeamScrum;