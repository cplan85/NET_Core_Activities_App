import React, { useEffect, useState } from "react";
import { Button, Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Profile } from "../../app/models/profile";

interface Props {
    profile: Profile;
    updateProfile: (profile: Partial<Profile>) => void;
}

export default observer( function ProfileEditForm({profile, updateProfile}: Props) {
const {profileStore} = useStore();
const {loadProfile, loading} = profileStore;
const navigate = useNavigate();

//const [activity, setProfile] = useState<Partial<Profile>>(new Profile());

const validationSchema = Yup.object({
    displayName: Yup.string().required('The display name is required'),
    bio: Yup.string().required('The bio is required'),
    
})


// useEffect(() => {
//     if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
// }, [id, loadActivity])



    if (loading) return <LoadingComponent content='Loading profile...' />
    
    return(
        <Container clearing>
            <Formik 
            validationSchema={validationSchema}
            enableReinitialize 
            initialValues={profile}
            onSubmit={values => updateProfile(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty}) => (
                     <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='Display Name' />
                         
                         <MyTextArea rows={3} placeholder='Bio' name='bio' />
                         <Button 
                         disabled={!dirty || !isValid}
                         loading={isSubmitting} 
                         floated='right' 
                         positive type='submit' content='Submit' />
                         <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
                     </Form>
                )}
            </Formik>
       
        </Container>
    )
} )