import React from 'react';
import SkillModel from '../../database/model/skillModel';

import { Button } from '../Button';

import { Input, Form, FormTitle } from './styles';

type Props = {
  name: string;
  setName: () => void;
  handleSave: () => void;
  skill: SkillModel;
}

export default function  FormContent({ name, setName, handleSave, skill} : Props){
    return (
          <Form>
          <FormTitle>{skill?.id ? 'Edit' : 'New'}</FormTitle>

          <Input
            placeholder="New skill..."
            onChangeText={setName}
            value={name}
          />

          <Button
            title={skill.id ? "Edit" : "Save"}
            onPress={handleSave}
          />
        </Form>
    )
}