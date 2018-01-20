import GlobalConfiguration from "@/configurations/GlobalConfiguration";
import { Languages } from "@/configurations/language/Languages";
import * as React from "react";
import { Col, Container, FormGroup, Input, Label, Row } from "reactstrap";

interface IConfigurationProps {
  //
}

interface IConfigurationStates {
  anticaptchaKey: string;
  lang: Languages;
  showDebugMessages: boolean;
}

export default class Configuration extends React.Component<IConfigurationProps, IConfigurationStates> {

  constructor(props: IConfigurationProps) {
    super(props);
    this.state = {
      anticaptchaKey: GlobalConfiguration.anticaptchaKey,
      lang: GlobalConfiguration.lang,
      showDebugMessages: GlobalConfiguration.showDebugMessages,
    };
  }

  public render() {
    return (
      <Container>
        <Row>
          <Col>
            <FormGroup>
              <Label for="lang">Lang</Label>
              <Input type="select" id="lang"
                value={this.state.lang}
                onChange={(event) => this.langChanged(event)}>
                <option value={Languages.FRENCH}>{Languages.FRENCH}</option>
                <option value={Languages.ENGLISH}>{Languages.ENGLISH}</option>
                <option value={Languages.SPANISH}>{Languages.SPANISH}</option>
                <option value={Languages.ITALIAN}>{Languages.ITALIAN}</option>
                <option value={Languages.DEUTSCH}>{Languages.DEUTSCH}</option>
                <option value={Languages.PORTUGUESE}>{Languages.PORTUGUESE}</option>
              </Input>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox"
                  checked={this.state.showDebugMessages}
                  onChange={(event) => this.showDebugMessagesChanged(event)} />
                Show debug messages
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    );
  }

  private langChanged(e) {
    this.setState({ lang: e.target.value });
    GlobalConfiguration.lang = e.target.value;
  }

  private showDebugMessagesChanged(event) {
    this.setState({
      showDebugMessages: event.target.checked,
    });
    GlobalConfiguration.showDebugMessages = event.target.checked;
  }
}