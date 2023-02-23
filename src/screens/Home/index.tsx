import React, { useRef, useState, useEffect } from 'react';
import { FlatList, Alert } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import { Menu, MenuTypeProps } from '../../components/Menu';
import { Skill } from '../../components/Skill';
import FormContent from '../../components/FormContent';

import { Container, Title, Input, Form, FormTitle } from './styles';

import { dataBase } from '../../database';
import SkillModel from '../../database/model/skillModel';
import { Q } from '@nozbe/watermelondb';

export function Home() {
  const [type, setType] = useState<MenuTypeProps>("soft");
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<SkillModel[]>([]);
  const [skill, setSkill] = useState<SkillModel>({} as SkillModel);

  const bottomSheetRef = useRef<BottomSheet>(null);

  async function handleSave(){
    try {
      
      if(skill.id){
        await updateSkill();
      } else {
        await createSkill();
      }

      bottomSheetRef.current?.collapse();
      setName('');
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchData(){
   try {
    const skillCollection = await dataBase
      .get<SkillModel>('skills')
      .query(Q.where('type', type))
      .fetch();
    
      console.log(skillCollection);
      setSkills(skillCollection);
   }  catch (error) {
      console.log(error);
    }
  }

  async function handleRemove(item: SkillModel){
    try {

      await dataBase.write(async() => {
         await item.destroyPermanently();
      });
      
       Alert.alert('Deleted!');
       await fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEdit(item: SkillModel){
   try {

    setSkill(item);
    setName(item.name);
    bottomSheetRef.current?.expand();

   } catch (error) {
    console.log(error);
   }
  }

  async function updateSkill(){
    await dataBase.write(async() => {
        await skill.update(data => {
          data.name = name,
          data.type = type
        })
    });

    setSkill({} as SkillModel);
    Alert.alert('Updated!');
  }
  
  async function createSkill(){
    await dataBase.write(async() => {
        await dataBase
        .get<SkillModel>('skills')
        .create(data => {
          data.name = name,
          data.type = type,
          data.createdAt = new Date().getTime()
        })
      });
      
      Alert.alert('Created!');
  }

  useEffect(()=> {
    fetchData();
  }, [type]);

  return (
    <Container>
      <Title>About me</Title>
      <Menu
        type={type}
        setType={setType}
      />

      <FlatList
        data={skills}
        keyExtractor={item => item?.id}
        renderItem={({ item }) => (
          <Skill
            data={item}
            onEdit={() => handleEdit(item)}
            onRemove={() => handleRemove(item)}
          />
        )}
      />
      <FormContent name={name} setName={setName} skill={skill} handleSave={handleSave} />
    </Container>
  );
}