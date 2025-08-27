import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileSpreadsheet, Users, TrendingUp, Upload, Eye, Download } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-sm shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Excel Analytics Platform
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-primary-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-primary hover:bg-gradient-hero text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Transform Your <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Excel Data</span>
            <br />into Beautiful Charts
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Upload Excel files, analyze data with AI, and generate interactive 2D & 3D charts.
            Perfect for data visualization and business intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                <Upload className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 py-3">
                <Eye className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Analytics Made Simple
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                  <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Excel File Upload</CardTitle>
                <CardDescription>
                  Seamlessly upload and parse .xlsx, .xls, and .csv files with automatic data extraction
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Interactive Charts</CardTitle>
                <CardDescription>
                  Generate 2D & 3D charts including bar, line, pie, scatter plots with dynamic axis selection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>
                  Get smart insights and summary reports from your data using integrated AI APIs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Download your charts as PNG, PDF, or interactive formats for presentations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Secure authentication with role-based access control and admin dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <CardTitle>History & Analytics</CardTitle>
                <CardDescription>
                  Track upload history, view analytics, and manage your data visualization projects
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust our platform for their data visualization needs
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Excel Analytics Platform. Built with React, Redux, Chart.js, and Three.js.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
