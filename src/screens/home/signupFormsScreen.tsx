import React, { useState, useRef, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text } from 'react-native'
import colors from '../../constants/colors'
import Links from '../../components/homeScreen/links'
import { useSelector } from 'react-redux'
import StepIndicator from 'react-native-step-indicator';
import SignupForm1 from '../../components/homeScreen/signUpForms/signupForm1'
import MySymptoms from '../../components/homeScreen/signUpForms/mySymptoms'
import AddTreatments from '../../components/homeScreen/signUpForms/addTreatments'
import AddYourStory from '../../components/homeScreen/signUpForms/addYourStory'
import SignupForm2 from '../../components/homeScreen/signUpForms/signupForm2'
import fonts from '../../constants/fonts'

const SignupFormsScreen = (props: any) => {
    const excludedRoles: Array<number> = [3, 4]
    const selectedCircle = useSelector((state: any) => state.app.selectedCircle)
    const [currentPosition, setCurrentPosition] = useState(0);
    const scrollRef = useRef<ScrollView | any>();
    const [selectedRole, setselectedRole] = useState()

    const labels = ["WELCOME", "SYMPTOMS", "TREATMENTS", "YOUR STORY"];
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: selectedCircle.color_code,
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: selectedCircle.color_code,
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: selectedCircle.color_code,
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: selectedCircle.color_code,
        stepIndicatorUnFinishedColor: '#aaaaaa',
        stepIndicatorCurrentColor: selectedCircle.color_code,
        stepIndicatorLabelFontSize: 0,
        currentStepIndicatorLabelFontSize: 0,
        stepIndicatorLabelCurrentColor: 'transparent',
        stepIndicatorLabelFinishedColor: 'transparent',
        stepIndicatorLabelUnFinishedColor: 'transparent',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: selectedCircle.color_code
    }

    useEffect(() => {
        if (props?.route?.params?.selectedRole) {
            setselectedRole(props.route.params.selectedRole)
        }
    }, [props.route])

    const goToTop = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true
        });
    }

    const handleNext = () => {
        goToTop()
        setCurrentPosition(currentPosition + 1)
    }

    const handlePrevious = () => {
        if (currentPosition === 0) {
            props.navigation.goBack()
        } else {
            goToTop()
            setCurrentPosition(currentPosition - 1)
        }
    }

    const renderLabel = ({
        position,
        label,
        currentPosition,
    }: {
        position: number;
        stepStatus: string;
        label: string;
        currentPosition: number;
    }) => {
        return (
            <Text
                style={
                    position === currentPosition
                        ? { ...styles.stepLabelSelected, color: selectedCircle.color_code }
                        : styles.stepLabel
                }
            >
                {label}
            </Text>
        );
    };

    const getScreen = () => {
        switch (currentPosition) {
            case 0: {
                return <SignupForm1 setselectedRole={setselectedRole} selectedRole={selectedRole} handleNext={handleNext} handlePrevious={handlePrevious} />
            }
            case 1: {
                return <MySymptoms selectedRole={selectedRole} handleNext={handleNext} handlePrevious={handlePrevious} />;
            }
            case 2: {
                return <AddTreatments selectedRole={selectedRole} handleNext={handleNext} handlePrevious={handlePrevious} />
            }
            case 3: {
                return <AddYourStory selectedRole={selectedRole} {...props} handleNext={handleNext} handlePrevious={handlePrevious} />
            }
            default: {
                return <SignupForm1 selectedRole={selectedRole} handleNext={handleNext} handlePrevious={handlePrevious} />
            }
        }
    }

    return (
        <ScrollView ref={scrollRef} nestedScrollEnabled={true} style={styles.screen}>
            {(!excludedRoles.includes(selectedRole)) ? <View style={styles.header}>
                <StepIndicator
                    customStyles={customStyles}
                    currentPosition={currentPosition}
                    labels={labels}
                    renderLabel={renderLabel}
                    stepCount={4}
                />
            </View> : null}
            <View style={styles.body}>
                <View style={styles.formContainer}>
                    {(!excludedRoles.includes(selectedRole)) ?
                        getScreen() :
                        <SignupForm2 selectedRole={selectedRole} {...props} handlePrevious={handlePrevious} />}
                </View>
            </View>
            <View style={styles.footer}>
                <Links color={selectedCircle.color_code} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
    },
    header: {
        paddingVertical: 20
    },
    body: {
        backgroundColor: colors.secondary
    },
    footer: {

    },
    formContainer: {

    },
    stepLabel: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: fonts.LATO_REGULAR,
        color: '#999999',
    },
    stepLabelSelected: {
        fontSize: 12,
        fontFamily: fonts.LATO_REGULAR,
        textAlign: 'center'
    },
})

export default SignupFormsScreen
