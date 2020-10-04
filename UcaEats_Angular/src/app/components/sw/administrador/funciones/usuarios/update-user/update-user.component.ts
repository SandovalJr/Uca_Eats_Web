import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import {
  AuthenticationService,
  UserDetails,
  TokenPayload,
} from "../../../../../../../services/authentication.service";
import { MessageErrorsService } from "../../../../../../../services/messageError.service";
import { Router } from "@angular/router";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

// SWEETALERT 2
// declarar variable de esta manera para que no marque err
declare var require: any;
const Swal = require("sweetalert2");

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  styleUrls: ["./update-user.component.scss"],
})
export class UpdateUserComponent implements OnInit {
  public formulario: FormGroup;
  details: UserDetails;

  credentials: TokenPayload = {
    user_id: 0,
    username: "",
    first_name: "",
    last_name: "",
    gender: "",
    password: "",
    UserType: "",
    phone: "",
  };

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private MessageErrorSvr: MessageErrorsService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.creatForm();
    this.PredefinirCliente();
    this.infoParaEditar();
  }

  public PredefinirCliente() {
    this.credentials.UserType = "cliente";
  }

  public infoParaEditar() {
    let user_id = this.activatedRouter.snapshot.paramMap.get("user_id");
    this.auth.InfoUserID(user_id).subscribe(
      (userData) => {},
      (err) => {
        console.log(err);
      }
    );
  }

  public creatForm() {
    this.formulario = new FormGroup({
      username: new FormControl(null, [RxwebValidators.required()]),
      first_name: new FormControl(null, [
        RxwebValidators.required(),
        RxwebValidators.alpha(),
      ]),
      last_name: new FormControl(null, [
        RxwebValidators.required(),
        RxwebValidators.alpha(),
      ]),
      gender: new FormControl(null, [
        RxwebValidators.required(),
        RxwebValidators.alpha(),
      ]),
      password: new FormControl(null, [RxwebValidators.required()]),
      phone: new FormControl(null, [RxwebValidators.required()]),
    });
  }

  public ValidarFormulario(control: string) {
    if (!this.formulario.controls[control].touched) return { error: undefined };
    return this.MessageErrorSvr.errorMessage(
      this.formulario.controls[control].errors
    );
  }
}