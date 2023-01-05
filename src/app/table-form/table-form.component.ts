
import {
    Component,
    OnInit
  } from '@angular/core';
  import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
  } from '@angular/forms';
  import {
    DataService
  } from '../data.service';
  
  @Component({
    selector: 'app-table-form',
    templateUrl: './table-form.component.html',
    styleUrls: ['./table-form.component.scss']
  })
  export class TableFormComponent implements OnInit {
  
    public empForm!: FormGroup;
  
    public localData: any;
  
    public combRes: any = [];
  
    public projects: any = [];
    public employees: any = [];
    public employeeProject: any = [];
    public employeeDetails: any = [];
  
    public EmpData: any = [];
    public formDataArray: any = [];
  
    public localStorageData: any;

    public randomId:any;

    constructor(private formBuilder: FormBuilder, private dataService: DataService) {}
  
    ngOnInit(): void {
  
      this.getEmpForm();
      this.gettingData();
      this.dataRetrive();

    }
    public getEmpForm() {
      this.empForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        department: ['', [Validators.required]],
        project: this.formBuilder.array([
          new FormControl(null, [Validators.required])
        ]),
      })
    }
    addProject() {
      const control = new FormControl(null, [Validators.required]);
      ( < FormArray > this.empForm.get('project')).push(control);
    }
    get projectControls() {
      return ( < FormArray > this.empForm.get('project')).controls;
    }
    public onSubmit() {
      const formValues = this.empForm.value;
      console.log(formValues);
      this.formDataArray.push(formValues);
      this.generateId();
      this.formDataArray.forEach((item:any)=>{
        if(item["id"] == undefined){
          Object.assign(item,{id:this.randomId})
        }

      })
      localStorage.setItem("formData", JSON.stringify(this.formDataArray));  
      this.empForm.reset();
    }
  
    public gettingData() {
  
      this.dataService.getData().subscribe((results: any) => {
        this.employees = results[0];
        this.employees = this.employees.employees;
        this.projects = results[1];
        this.projects = this.projects.projects;
        this.employeeProject = results[2];
        this.employeeProject = this.employeeProject.employeeProject
        this.employeeDetails = results[3];
        this.employeeDetails = this.employeeDetails.employeeDetails;
        this.combRes = results;

        this.employees.forEach((item:any)=>{
          this.employeeDetails.forEach((a:any)=>{
            if(item.id === a.empId){
              item.designation = a.designation;
              item.department = a.department;
            }
          })
        })
        this.employeeProject.forEach((b:any)=>{
          this.projects.forEach((c:any)=>{
            if(b.project === c.id){
              b.projectName = c.name;
            }
          })
        })
        this.employees.forEach((item1:any)=>{
          this.employeeProject.forEach((item2:any)=>{

            if(item1.id === item2.empId){
              item1.project='project assigned'
             item1.control=true;

            }


          })
        })
      },
      (err)=>{
        console.log(err);
      }
      )
    }
  
    public dataRetrive() {
  
      this.localStorageData = localStorage.getItem('formData');
      this.formDataArray = JSON.parse(this.localStorageData);
    }
  
    public generateId(){
      this.randomId = Math.floor(Math.random() * (1000 - 110 + 1)) + 110;
      return this.randomId;
    }
  

  
  }
  