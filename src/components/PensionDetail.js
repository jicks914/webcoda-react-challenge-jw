import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import useGetTravellingData from '../GetDataHook';
import { formatDateTime, getSupportedCurrencies, handleError } from '../utils';
import * as api from '../api';
import {
  mockDoctors,
  mockExchangeRates,
  mockExchangeRateTime,
} from '../__mock';

// TODO: need major refactoring
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

  handleInputUpdate = (e) => {
    this.setState({ personalDetail : { ...this.state.personalDetail, [e.target.name]: e.target.value}});
  }

  handleCheckboxUpdate = (e) => {
    this.setState({ personalDetail : { ...this.state.personalDetail, [e.target.name]: e.target.checked}});
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
      api.submitRequest(this.state).then(response => {
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
    // TODO: use useGetTravellingData() to retrieve travelling data.
    // Below code is commented out, compilation error, use mock data for now.
    // const travellingData = useGetTravellingData();
    const travellingData = {
      doctors: mockDoctors.results,
      exchangeRates: getSupportedCurrencies(mockExchangeRates.rates),
      exchangeRateTime: formatDateTime(mockExchangeRateTime.epoch),
    };

    // TODO: returned markup is too long, can we do something about them?
    // Hint: Repeated checkboxes and styling, split markups into components
    return (
      <Container>
        <div>
          <h2>Pension detail</h2>
        </div>

        <form>
          <div>
            <label>
              <div>Name *</div>
              <input 
                required
                type="text"
                name="name"
                value={this.state.personalDetail.name}
                placeholder="Enter name"
                onChange={this.handleInputUpdate} 
              />
            </label>
            {this.state.formErrors.name === true ? (
              <div>
                This field is required.
              </div>
            ):('')}
          </div>

          <div>
            <label>
              <div>Insured Amount *</div>
              <input 
                required
                type="text"
                name="amount"
                value={this.state.personalDetail.amount}
                placeholder="Enter amount"
                onChange={this.handleInputUpdate} 
                />
            </label>
            {this.state.formErrors.amount === true ? (
              <div>
                This field is required.
              </div>
            ):('')}
          </div>

          <div>
            <div>
              <label>Age *</label>
            </div>
            <select
              required
              value={this.state.personalDetail.age ? this.state.personalDetail.age : ''}
              onChange={this.handleInputUpdate}
              name="age"
            >
              <option value="">Choose...</option>
              <option value="21-40">Between 21 - 40</option>
              <option value="41-60">Between 41 - 60</option>
              <option value="61-">Above 60</option>
            </select>
            {this.state.formErrors.age === true ? (
              <div>
                This field is required.
              </div>
            ):('')}
          </div>

          <div>
            <label>
              <input 
                type="checkbox"
                name="isSmoker"
                checked={this.state.personalDetail.isSmoker}
                onChange={this.handleCheckboxUpdate}
              />
              <span>
                Are you a smoker?
              </span>
            </label>
          </div>

          <div>
            <label>
              <input 
                type="checkbox"
                name="isDrinker"
                checked={this.state.personalDetail.isDrinker}
                onChange={this.handleCheckboxUpdate}
              />
              <span>
                Do you have history of issue with alcohol?
              </span>
            </label>
          </div>

          <div>
            <label>
              <input 
                type="checkbox"
                name="isTerminallyIll"
                checked={this.state.personalDetail.isTerminallyIll}
                onChange={this.handleCheckboxUpdate}
              />
              <span>
                Do you have terminal illness (eg. final stage of cancer)?
              </span>
            </label>
          </div>

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
                <Card style={{ width: '100%' }}>
                  <Card.Body>
                    <Card.Title>
                      <p>International doctors</p>
                    </Card.Title>
                    <Card.Text>
                      <div>
                        {(travellingData.doctors || []).map((doctor, index) => (
                          <div
                            key={index}
                            style={{ width: '20%', float: 'left' }}
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
                <Card style={{ width: '100%' }}>
                  <Card.Body>
                    <Card.Title>Exchange rates</Card.Title>
                    <Card.Text>
                      <div style={{ display: 'block' }}>
                        {travellingData.exchangeRates.map(
                          (exchangeRate, index) => (
                            <div
                              key={index}
                              style={{ width: '20%', float: 'left' }}
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

export default PensionCalculation;
