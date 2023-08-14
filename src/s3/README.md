# AWS Setup User Guide

## Installation
Amazon Web Services provides a Command Line Interface (CLI) imperative for proper functioning. 

### MacOS
* Run the following commands.
  
```bash
$ curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
$ sudo installer -pkg AWSCLIV2.pkg -target /
```

### Windows

* Download the [official AWS CLI MSI installer](https://awscli.amazonaws.com/AWSCLIV2.msi) or run

```cmd
C:\> msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

(For the full instructions from Amazon, click [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)).

## Setting environment variables for a user

> **Note:** If you are using the S3 Module as a user, generate an access key/private key pair before continuing.

The S3 Module uses secret environment variables in a dotenv file in the repo's root directory that is gitignored, as it contains information particular to the user or IAM role. The dotenv file is formatted as such:

```
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
AWS_S3_BUCKET=<your-s3-bucket>
AWS_REGION=<your-region>
```

For our purposes, the following global variables are set:

```
AWS_REGION=us-east-2
```

In the dotenv file, replace the following:
* `<your-access-key>` with your access key.
* `<your-secret-access-key>` with your secret acess key.
* `<your-s3-key>` with your S3 bucket name, such as `rp-2023-resumes`.

Now, export the environment variables. Make sure to replace all keys as necessary.

### MacOS
* Run the following commands:

```bash
$ export AWS_ACCESS_KEY_ID=<your-access-key>
$ export AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
$ export AWS_REGION=<your-region>
```

* Run `aws configure` and press enter through all the prompts. Do NOT enter any information, as it will override your environment variables.

### Windows
* Run the following commands:
  
```cmd
C:\> setx AWS_ACCESS_KEY_ID=<your-access-key>
C:\> setx AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
C:\> setx AWS_REGION=<your-region>
```

* Run `aws configure` and press enter through all the prompts. Do NOT enter any information, as it will override your environment variables.

## Setting environment variables for an IAM role
* Run `aws configure` and press enter through all the prompts.
* Run the following command, replacing `arn:aws:iam::123456789012:role/S3access` with the ARN of your IAM role.
```bash
aws s3 ls --role-arn arn:aws:iam::123456789012:role/S3access
```

## Checking configurations

### Configurations for a user

Run the following command:

```bash
aws configure list
```

The output should be something like this:

```bash
      Name                    Value             Type    Location
      ----                    -----             ----    --------
   profile                <not set>             None    None
access_key     ****************XXXX              env    
secret_key     ****************XXXX              env    
    region              your-region              env    ['AWS_REGION', 'AWS_DEFAULT_REGION']
```

### Configurations for an IAM role
Run the following command:

```bash
aws configure list
```

The output should be something like this:

```bash
      Name                    Value             Type    Location
      ----                    -----             ----    --------
   profile                <not set>             None    None
access_key     ****************XXXX         iam-role
secret_key     ****************XXXX         iam-role
    region              your-region      config-file    ~/.aws/config
```