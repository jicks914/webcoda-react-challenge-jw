import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import useGetTravellingData from '../GetDataHook';
import { handleError } from '../utils';
import * as api from '../api';
import InputField from './InputField';

class PensionCalculation extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      personalDetail: {
        name: '',
        amount: '',
        age: '',
        isSmoker: false,
        isDrinker: false,
        isTerminallyIll: false,
      },
      formErrors: {
        name: false,
        amount: false,
        age: false,
      }
    };
  }
  

  componentDidMount = () => {};

  componentDidUpdate(prevProps, prevState) {}

  validateFields = () => {

    let hasError = false;
    const { name, amount, age } = this.state.personalDetail;
    let validationObj = {};

    if(name !== null && name.length === 0) {
      validationObj.name = true;
      hasError = true;
    } else {
      validationObj.name = false;
    }
    
    if(amount !== null && amount.length === 0) {
      validationObj.amount = true;
      hasError = true;
    } else {
      validationObj.amount = false;
    }
    
    if(age !== null && age.length === 0) {
      validationObj.age = true;
      hasError = true;
    } else {
      validationObj.age = false;
    }

    this.setState({ formErrors : validationObj })

    return hasError;
  }

  clearForm = () => {
    const clearPersonalDetailObj = {
      name: '',
      amount: '',
      age: '',
      isSmoker: false,
      isDrinker: false,
      isTerminallyIll: false,
    };
    const formErrorsObj = {
      name: false,
      amount: false,
      age: false,
    }
    this.setState({ personalDetail: clearPersonalDetailObj });
    this.setState({ formErrors: formErrorsObj });
  }

  handleInputChange = (input, inputType) => {
    if(inputType === 'checkbox') {
      this.setState({ personalDetail : { ...this.state.personalDetail, [input.target.name]: input.target.checked}})
    } else {
      this.setState({ personalDetail : { ...this.state.personalDetail, [input.target.name]: input.target.value}});
    }
  }

  submitForm = (e) => {

    e.preventDefault();

    const hasErrors = this.validateFields();
    if(hasErrors) {
      return;
    }

    // TODO: success notice shows before submission completes
    try {
      console.log('submitting data...')
      api.submitRequest(this.state.personalDetail).then(response => {
        console.log('success');
        console.log(response);
        alert('Form successfully sent.')
      }, error => {
        console.log('error')
        handleError(error);
      });
    } catch (e) {
      // TODO: not returning correct error message, if any
      alert(e);
    }

  }

  render() {

    const travellingData = this.props.travelData;
    const ageSelectData = [
      {
        "label": "Choose...",
        "value": ""
      },
      {
        "label": "Between 21 - 40",
        "value": "21-40"
      },
      {
        "label": "Between 41 - 60",
        "value": "41-60"
      },
      {
        "label": "Above 60",
        "value": "61-"
      },
    ];

    // TODO: returned markup is too long, can we do something about them?
    // Hint: Repeated checkboxes and styling, split markups into components
    return (
      <Container>
        <div>
          <h2>Pension detail</h2>
        </div>

        <form>

          <InputField
            id="person-name"
            inputType="text"
            inputName="name"
            label="Name *"
            isRequired={true}
            updateInputValue={this.handleInputChange} 
            value={this.state.personalDetail.name}
            hasError={this.state.formErrors.name}
            placeholder="Enter name..."
          />

          <InputField
            id="insured-amount"
            inputType="text"
            inputName="amount"
            label="Enter amount"
            isRequired={true}
            updateInputValue={this.handleInputChange} 
            value={this.state.personalDetail.amount}
            hasError={this.state.formErrors.amount}
          />

          <InputField
            id="pension-age"
            inputType="select"
            inputName="age"
            label="Select one of the following"
            isRequired={true}
            inputSelectData={ageSelectData}
            updateInputValue={this.handleInputChange} 
            value={this.state.personalDetail.age}
            hasError={this.state.formErrors.age}
          />
          
          <InputField
            inputType="checkbox" 
            inputName="isSmoker"
            updateInputValue={this.handleInputChange} 
            isChecked={this.state.personalDetail.isSmoker}
            label="Are you a smoker?"
          />

          <InputField
            inputType="checkbox" 
            inputName="isDrinker"
            updateInputValue={this.handleInputChange} 
            isChecked={this.state.personalDetail.isDrinker}
            label="Do you have history of issue with alcohol?"
          />

          <InputField
            inputType="checkbox" 
            inputName="isTerminallyIll"
            updateInputValue={this.handleInputChange} 
            isChecked={this.state.personalDetail.isTerminallyIll}
            label="Do you have terminal illness (eg. final stage of cancer)?"
          />

          <div className="mb-2">
            <Button
              id="submit"
              type="submit"
              variant="primary"
              onClick={(e) => {this.submitForm(e)}}
            >
              Submit
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                this.clearForm();
              }}
            >
              Clear
            </Button>
          </div>
        </form>

        <br />

        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Thinking of travelling?
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                {/* TODO: Use Bootstrap to allow responsive look-and-feel */}
                {/* A row to display 6 doctors on large, 3 on medium, 1 on small screen */}
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <p>International doctors</p>
                    </Card.Title>
                    <Card.Text>
                      <div className="row">
                        {(travellingData.doctors || []).map((doctor, index) => (
                          <div
                            key={index}
                            className="col-md-2 col-sm-4"
                          >
                            <Card>
                              <Card.Img
                                variant="top"
                                src={doctor.picture.large}
                              />
                              <Card.Body>
                                <Card.Text>
                                  <a
                                    href={`mailto: {doctor.email}`}
                                  >{`${doctor.name.title} ${doctor.name.first} ${doctor.name.last} (${doctor.nat})`}</a>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>

                {/* TODO: Use Bootstrap to allow responsive look-and-feel */}
                {/* A row to display 3 rates on large, 1 on small screen */}
                <Card>
                  <Card.Body>
                    <Card.Title>Exchange rates</Card.Title>
                    <Card.Text>
                      <div className="row">
                        {travellingData.exchangeRates.map(
                            (exchangeRate, index) => (
                              <div
                                key={index}
                                className="col-sm-4 col-12"
                              >
                                <p>{exchangeRate.name}</p>
                                <p>{exchangeRate.value}</p>
                              </div>
                            )
                          )}
                      </div>
                      
                      <div style={{ clear: 'both', display: 'block' }}>
                        Last updated: {travellingData.exchangeRateTime}
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    );
  }
}

const PensionWrapper = () => {

  const travellingData = useGetTravellingData();
  
  return <PensionCalculation travelData={travellingData} />
  
}


export default PensionWrapper;
